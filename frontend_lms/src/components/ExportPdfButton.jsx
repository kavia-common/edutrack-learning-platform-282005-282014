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
    const DIAG = (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV) !== 'production';
    const log = (...args) => { if (DIAG) try { console.debug('[ExportPdfButton]', ...args); } catch {} };

    // Visual feedback
    let btn;
    try { btn = document.activeElement; if (btn) btn.setAttribute('data-busy', 'true'); } catch {}

    let outcome = { success: false, blob: null, dataUrl: null, error: '' };
    try {
      if (targetRef?.current) {
        outcome = await exportElementToPdf(targetRef.current, filename, {
          returnBlob: true,
          returnDataUrl: true,
          skipSave: false,
          diagnostics: DIAG,
        });
      } else if (selector) {
        const el = document.querySelector(selector);
        if (el) {
          outcome = await exportElementToPdf(el, filename, {
            returnBlob: true,
            returnDataUrl: true,
            skipSave: false,
            diagnostics: DIAG,
          });
        } else {
          log('Selector not found', selector);
          outcome = { success: false, blob: null, dataUrl: null, error: 'selector-missing' };
        }
      } else {
        console.warn('[ExportPdfButton] Provide either targetRef or selector.');
        outcome = { success: false, blob: null, dataUrl: null, error: 'no-target' };
      }
    } catch (e) {
      log('Unhandled exception', e);
      outcome = { success: false, blob: null, dataUrl: null, error: 'exception' };
    } finally {
      try { if (btn) btn.removeAttribute('data-busy'); } catch {}
    }

    try {
      onExport && onExport({
        blob: outcome?.blob || null,
        dataUrl: outcome?.dataUrl || null,
        success: !!outcome?.success,
        error: outcome?.error || '',
      });
    } catch (e) {
      log('onExport callback error', e);
    }
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
