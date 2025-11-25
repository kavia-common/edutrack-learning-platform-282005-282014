import React from 'react';
import { exportElementToPdf, exportSelectorToPdf } from '../utils/exportPdf';

/**
 * PUBLIC_INTERFACE
 * ExportPdfButton
 * Small helper button to trigger PDF export for a given ref or selector.
 * Props:
 *  - targetRef?: React.RefObject<HTMLElement>
 *  - selector?: string (CSS selector)
 *  - filename?: string
 *  - label?: string
 *  - onExport?: (payload: { blob?: Blob, success: boolean }) => void
 *
 * Usage:
 *   const ref = useRef(null);
 *   <div ref={ref}> ... </div>
 *   <ExportPdfButton targetRef={ref} filename="section.pdf" onExport={({blob}) => submit(blob)} />
 *
 *   or by selector:
 *   <ExportPdfButton selector="#exportable" label="Download PDF" />
 */
const ExportPdfButton = ({ targetRef, selector, filename = 'page-export.pdf', label = 'Download PDF', disabled = false, style, onExport }) => {
  const onClick = async () => {
    let ok = false;
    let blob = null;

    // We try to generate without saving automatically by intercepting in export util,
    // but since export utils currently save directly, we create a best-effort Blob using print fallback detection.
    // To ensure we can submit the PDF, we augment export utils to also return a Blob when successful.
    if (targetRef?.current) {
      ok = await exportElementToPdf(targetRef.current, filename);
    } else if (selector) {
      ok = await exportSelectorToPdf(selector, filename);
    } else {
      console.warn('[ExportPdfButton] Provide either targetRef or selector.');
    }

    // If export utils eventually support returning a Blob, pass it along; for now blob stays null.
    try { onExport && onExport({ blob, success: !!ok }); } catch { /* ignore */ }
  };

  return (
    <button
      type="button"
      className="btn"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        // Derive from unified button tokens; keep width customizable via style prop
        background: disabled ? 'var(--button-bg)' : 'var(--button-bg)',
        color: 'var(--button-text)',
        border: '1px solid var(--btn-border)',
        minWidth: 140,
        ...(style || {}),
      }}
    >
      {label}
    </button>
  );
};

export default ExportPdfButton;
