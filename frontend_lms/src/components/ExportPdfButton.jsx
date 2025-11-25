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
    let outcome = { success: false, blob: null, error: '' };
    try {
      if (targetRef?.current) {
        outcome = await exportElementToPdf(targetRef.current, filename, { returnBlob: true, skipSave: false });
      } else if (selector) {
        // Use selector helper but we need blob; call underlying util after resolving element
        const res = await exportSelectorToPdf(selector, filename, { returnBlob: true, skipSave: false });
        outcome = res && typeof res === 'object' ? res : { success: !!res, blob: null };
      } else {
        console.warn('[ExportPdfButton] Provide either targetRef or selector.');
        outcome = { success: false, blob: null, error: 'no-target' };
      }
    } catch (e) {
      outcome = { success: false, blob: null, error: 'exception' };
    }

    try { onExport && onExport({ blob: outcome?.blob || null, success: !!outcome?.success }); } catch { /* ignore */ }
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
