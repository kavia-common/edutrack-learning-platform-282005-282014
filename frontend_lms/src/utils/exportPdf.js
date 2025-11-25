//
// Reusable PDF export utilities for capturing DOM elements using html2canvas + jsPDF.
// This implements multi-page handling, sharp rendering (scale:2), and CORS support.
// Usage notes:
//  - Prefer passing a specific container element (e.g., a card or content section) rather than the whole page.
//  - Ensure any web fonts/images are loaded; the function waits briefly before capture.
//  - Example:
//      import { exportElementToPdf, exportSelectorToPdf } from '../utils/exportPdf';
//      const ref = useRef(null);
//      <button onClick={() => exportElementToPdf(ref.current, 'my-export.pdf')}>Download PDF</button>
//      // or by selector:
//      <button onClick={() => exportSelectorToPdf('#content', 'my-export.pdf')}>Download PDF</button>
//
/* eslint-disable no-console */

/* eslint-disable no-console */
// PUBLIC_INTERFACE
export async function exportElementToPdf(element, filename = 'page-export.pdf', options = {}) {
  /**
   * Capture a DOM element into a multi-page A4 portrait PDF using html2canvas + jsPDF.
   * - element: HTMLElement or null
   * - filename: string, the PDF filename to save as
   * - options: { returnBlob?: boolean, returnDataUrl?: boolean, skipSave?: boolean, scale?: number }
   * Returns:
   *   - boolean true on success when not requesting blob/dataURL
   *   - { success: boolean, blob?: Blob, dataUrl?: string, error?: string } when returnBlob/returnDataUrl specified
   */
  if (typeof window === 'undefined') return options?.returnBlob || options?.returnDataUrl ? { success: false, error: 'no-window' } : false;
  if (!element) {
    const msg = '[exportElementToPdf] No element provided.';
    console.warn(msg);
    return options?.returnBlob || options?.returnDataUrl ? { success: false, error: 'no-element' } : false;
  }

  // Allow fonts/images to settle
  await new Promise((r) => setTimeout(r, 150));

  // Dynamic import libs
  let html2canvas = null;
  let jsPDFCtor = null;

  try {
    const h2c = await import(/* webpackChunkName: "html2canvas" */ 'html2canvas').catch(() => null);
    if (h2c && (h2c.default || h2c)) html2canvas = h2c.default || h2c;
  } catch { /* ignore */ }
  try {
    const jspdfMod = await import(/* webpackChunkName: "jspdf" */ 'jspdf').catch(() => null);
    if (jspdfMod && (jspdfMod.jsPDF || jspdfMod.default?.jsPDF)) {
      jsPDFCtor = jspdfMod.jsPDF || jspdfMod.default.jsPDF;
    }
  } catch { /* ignore */ }

  // CDN fallback for environments without dependencies installed
  if (!html2canvas) {
    try {
      await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      html2canvas = window.html2canvas || null;
    } catch { /* ignore */ }
  }
  if (!jsPDFCtor) {
    try {
      await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      jsPDFCtor = window.jspdf ? (window.jspdf.jsPDF || window.jspdf?.default?.jsPDF) : null;
    } catch { /* ignore */ }
  }

  if (!html2canvas || !jsPDFCtor) {
    const msg = '[exportElementToPdf] Missing html2canvas/jsPDF libraries.';
    console.warn(msg);
    if (options?.returnBlob || options?.returnDataUrl) {
      return { success: false, error: 'missing-libs' };
    }
    try { window.print(); } catch { /* ignore */ }
    return false;
  }

  // Add temp class to allow any .print-ready overrides in CSS
  element.classList?.add?.('print-ready');

  try {
    const scale = Math.max(1, Math.min(3, Number(options?.scale || 2)));
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: document.documentElement.clientWidth,
      onclone: (doc) => {
        // Ensure images have crossOrigin to reduce tainting risk
        doc.querySelectorAll('img').forEach((img) => {
          try { img.setAttribute('crossorigin', 'anonymous'); } catch { /* ignore */ }
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDFCtor({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 1) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeName = String(filename || 'page-export.pdf').trim() || 'page-export.pdf';

    const wantsBlob = !!options?.returnBlob;
    const wantsDataUrl = !!options?.returnDataUrl;
    if (wantsBlob || wantsDataUrl) {
      let blob = null;
      let dataUrl = null;
      let ok = true;
      let error = '';
      try {
        if (wantsBlob) blob = pdf.output('blob');
      } catch (e) {
        ok = false;
        error = 'blob-failed';
      }
      try {
        if (wantsDataUrl) dataUrl = pdf.output('datauristring');
      } catch (e) {
        ok = false;
        error = error || 'dataurl-failed';
      }
      if (!options?.skipSave) {
        try { pdf.save(safeName); } catch { /* ignore */ }
      }
      return { success: ok, blob, dataUrl, error };
    }

    // Default: save
    pdf.save(safeName);
    return true;
  } catch (e) {
    console.warn('[exportElementToPdf] Failed to generate PDF:', e);
    if (options?.returnBlob || options?.returnDataUrl) {
      return { success: false, error: 'exception' };
    }
    try { window.print(); } catch { /* ignore */ }
    return false;
  } finally {
    element.classList?.remove?.('print-ready');
  }
}

// PUBLIC_INTERFACE
export async function exportSelectorToPdf(selector, filename = 'page-export.pdf', options = {}) {
  /**
   * Convenience helper that resolves an element by query selector and invokes exportElementToPdf.
   */
  if (typeof window === 'undefined') return false;
  if (!selector || typeof selector !== 'string') {
    console.warn('[exportSelectorToPdf] Invalid selector.');
    return false;
  }
  const el = document.querySelector(selector);
  if (!el) {
    console.warn('[exportSelectorToPdf] Element not found for selector:', selector);
    return false;
  }
  return exportElementToPdf(el, filename, options);
}
