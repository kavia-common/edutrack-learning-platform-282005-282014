import React, { useMemo, useRef, useState } from 'react';
import Card from '../components/ui/primitives/Card';
import Button from '../components/ui/primitives/Button';
import Modal from '../components/ui/primitives/Modal';
import ExportPdfButton from '../components/ExportPdfButton.jsx';
import { submitDocument } from '../services/inbox';
import { useToast } from '../components/ui/Toast';

/**
 * PUBLIC_INTERFACE
 * OnboardingForm
 * A responsive form page to capture onboarding details based on the provided image.
 * Fields:
 *  - First Name, Last Name, Phone Number, Email Id (Personal), Date of Birth, Sex
 *  - Mailing Address, Permanent Address, Blood Group
 *  - Emergency Contact: Name, Phone Number, Relationship
 *  - Bank Account Details: Name of Bank, Address of Bank, IFSC Code, Account Number, Type of Account
 *
 * Validation:
 *  - First Name, Last Name, Phone, Email, DOB, Sex, Emergency Contact Name, Emergency Contact Phone, Account Number are required.
 *  - Email pattern and basic phone length checks.
 *
 * Behavior:
 *  - On submit, validates and shows a success modal with entered data (and logs to console).
 *  - Uses existing theme tokens and UI primitives; supports light/dark.
 */
export default function OnboardingForm() {
  const initialState = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      sex: '',
      mailingAddress: '',
      permanentAddress: '',
      bloodGroup: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      bankName: '',
      bankAddress: '',
      ifsc: '',
      accountNumber: '',
      accountType: '',
    }),
    []
  );

  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const required = {
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    dob: true,
    sex: true,
    emergencyName: true,
    emergencyPhone: true,
    accountNumber: true,
  };

  const validators = {
    email: (v) => /\S+@\S+\.\S+/.test(String(v || '')),
    phone: (v) => String(v || '').replace(/\D/g, '').length >= 7,
    emergencyPhone: (v) => String(v || '').replace(/\D/g, '').length >= 7,
    ifsc: (v) => !v || /^[A-Za-z]{4}[A-Za-z0-9]{7}$/.test(String(v)), // loose IFSC check, optional
  };

  const errors = useMemo(() => {
    const e = {};
    Object.keys(form).forEach((k) => {
      const val = form[k];
      if (required[k] && !String(val || '').trim()) {
        e[k] = 'This field is required';
      } else if (validators[k] && !validators[k](val)) {
        e[k] = 'Invalid value';
      }
    });
    return e;
  }, [form]);

  const markTouched = (k) => setTouched((prev) => ({ ...prev, [k]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // touch all required fields
    const nextTouched = { ...touched };
    Object.keys(required).forEach((k) => { nextTouched[k] = true; });
    setTouched(nextTouched);

    if (Object.keys(errors).length > 0) {
      // focus the first error if available
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    // success path
    try {
      console.log('[OnboardingForm] Submitted:', form);
    } catch {
      // no-op
    }
    // persist JSON entry into Admin Inbox (local service)
    try {
      const email = (() => {
        try {
          const raw = window.localStorage.getItem('lms_auth');
          const session = raw ? JSON.parse(raw) : null;
          return session?.user?.email || form?.email || 'anonymous';
        } catch {
          return form?.email || 'anonymous';
        }
      })();
      const title = `Onboarding Submission – ${(form.firstName || '').trim() || 'User'} – ${new Date().toLocaleDateString()}`;
      // Use submitJson from inbox service to store JSON-only entry
      // Import is already present for submitDocument; we lazy import submitJson to keep tree-shaking safe.
      import('../services/inbox').then((mod) => {
        const submitJson = mod?.submitJson;
        if (typeof submitJson === 'function') {
          const saved = submitJson({ title, payload: form, type: 'onboarding', status: 'submitted', submittedBy: email });
          if (saved) {
            push?.({ type: 'success', message: 'Onboarding details submitted to Admin Inbox.' });
          } else {
            push?.({ type: 'error', message: 'Failed to save onboarding details to Inbox.' });
          }
        }
      }).catch(() => {});
    } catch {
      // ignore
    }
    setOpenModal(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid var(--border-color)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    transition: 'var(--transition-theme)',
  };

  const labelStyle = {
    display: 'grid',
    gap: 6,
  };

  const helpTextStyle = {
    fontSize: 12,
    color: 'var(--text-secondary)',
  };

  const errorStyle = {
    color: 'var(--error)',
    fontSize: 12,
  };

  const sectionTitle = (text) => (
    <h3 style={{ margin: '4px 0 8px', color: 'var(--text-primary)' }}>{text}</h3>
  );

  const exportScopeRef = useRef(null);
  const titleRef = useRef(null);
  // Initialize toast; if provider not mounted, use no-op
  let push = () => {};
  try {
    const t = useToast();
    push = t?.push || (() => {});
  } catch {
    // ignore
  }

  return (
    <main style={{ padding: 12 }}>
      <Card
        as="section"
        ref={exportScopeRef}
        id="onboarding-form-card"
        style={{ padding: 16, display: 'grid', gap: 14 }}
      >
        <h1 ref={titleRef} style={{ margin: 0 }}>Onboarding Form</h1>
        <p className="text-muted" style={{ marginTop: -6 }}>
          Please fill the details below. Fields marked with an asterisk (*) are required.
        </p>

        {/* Basic Info Section */}
        {sectionTitle('Personal Details')}
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(12, 1fr)',
          }}
        >
          <div style={{ gridColumn: 'span 6' }}>
            <label style={labelStyle}>
              <span>
                First Name <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                onBlur={() => markTouched('firstName')}
                aria-invalid={touched.firstName && !!errors.firstName}
                style={inputStyle}
                placeholder="John"
                required
              />
              {touched.firstName && errors.firstName && (
                <span role="alert" style={errorStyle}>{errors.firstName}</span>
              )}
            </label>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <label style={labelStyle}>
              <span>
                Last Name <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                onBlur={() => markTouched('lastName')}
                aria-invalid={touched.lastName && !!errors.lastName}
                style={inputStyle}
                placeholder="Doe"
                required
              />
              {touched.lastName && errors.lastName && (
                <span role="alert" style={errorStyle}>{errors.lastName}</span>
              )}
            </label>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Phone Number <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                onBlur={() => markTouched('phone')}
                aria-invalid={touched.phone && !!errors.phone}
                style={inputStyle}
                placeholder="+1 555 000 0000"
                required
              />
              <span style={helpTextStyle}>Enter digits only, min 7 digits.</span>
              {touched.phone && errors.phone && (
                <span role="alert" style={errorStyle}>{errors.phone}</span>
              )}
            </label>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Email Id (Personal) <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => markTouched('email')}
                aria-invalid={touched.email && !!errors.email}
                style={inputStyle}
                placeholder="you@example.com"
                required
              />
              {touched.email && errors.email && (
                <span role="alert" style={errorStyle}>{errors.email}</span>
              )}
            </label>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Date of Birth <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={(e) => setField('dob', e.target.value)}
                onBlur={() => markTouched('dob')}
                aria-invalid={touched.dob && !!errors.dob}
                style={inputStyle}
                required
              />
              {touched.dob && errors.dob && (
                <span role="alert" style={errorStyle}>{errors.dob}</span>
              )}
            </label>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Sex <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <select
                name="sex"
                value={form.sex}
                onChange={(e) => setField('sex', e.target.value)}
                onBlur={() => markTouched('sex')}
                aria-invalid={touched.sex && !!errors.sex}
                style={inputStyle}
                required
              >
                <option value="">Select…</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
              {touched.sex && errors.sex && (
                <span role="alert" style={errorStyle}>{errors.sex}</span>
              )}
            </label>
          </div>
        </div>

        {/* Addresses and Blood Group */}
        {sectionTitle('Address & Medical')}
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <div style={{ gridColumn: 'span 12' }}>
            <label style={labelStyle}>
              <span>Mailing Address</span>
              <textarea
                name="mailingAddress"
                rows={2}
                value={form.mailingAddress}
                onChange={(e) => setField('mailingAddress', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Current address"
              />
            </label>
          </div>
          <div style={{ gridColumn: 'span 12' }}>
            <label style={labelStyle}>
              <span>Permanent Address</span>
              <textarea
                name="permanentAddress"
                rows={2}
                value={form.permanentAddress}
                onChange={(e) => setField('permanentAddress', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Permanent address"
              />
            </label>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <label style={labelStyle}>
              <span>Blood Group</span>
              <input
                name="bloodGroup"
                type="text"
                value={form.bloodGroup}
                onChange={(e) => setField('bloodGroup', e.target.value)}
                style={inputStyle}
                placeholder="e.g., O+, A-, B+"
                list="blood-groups"
              />
              <datalist id="blood-groups">
                <option value="A+"/>
                <option value="A-"/>
                <option value="B+"/>
                <option value="B-"/>
                <option value="O+"/>
                <option value="O-"/>
                <option value="AB+"/>
                <option value="AB-"/>
              </datalist>
            </label>
          </div>
        </div>

        {/* Emergency Contact */}
        {sectionTitle('Emergency Contact')}
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Emergency Contact Name <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="emergencyName"
                type="text"
                value={form.emergencyName}
                onChange={(e) => setField('emergencyName', e.target.value)}
                onBlur={() => markTouched('emergencyName')}
                aria-invalid={touched.emergencyName && !!errors.emergencyName}
                style={inputStyle}
                placeholder="Contact full name"
                required
              />
              {touched.emergencyName && errors.emergencyName && (
                <span role="alert" style={errorStyle}>{errors.emergencyName}</span>
              )}
            </label>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Emergency Contact Phone Number <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="emergencyPhone"
                type="tel"
                value={form.emergencyPhone}
                onChange={(e) => setField('emergencyPhone', e.target.value)}
                onBlur={() => markTouched('emergencyPhone')}
                aria-invalid={touched.emergencyPhone && !!errors.emergencyPhone}
                style={inputStyle}
                placeholder="+1 555 000 0000"
                required
              />
              {touched.emergencyPhone && errors.emergencyPhone && (
                <span role="alert" style={errorStyle}>{errors.emergencyPhone}</span>
              )}
            </label>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>Emergency Contact Relationship</span>
              <input
                name="emergencyRelationship"
                type="text"
                value={form.emergencyRelationship}
                onChange={(e) => setField('emergencyRelationship', e.target.value)}
                style={inputStyle}
                placeholder="e.g., Parent, Spouse, Friend"
              />
            </label>
          </div>
        </div>

        {/* Bank Account Details */}
        {sectionTitle('Bank Account Details')}
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <div style={{ gridColumn: 'span 6' }}>
            <label style={labelStyle}>
              <span>Name of Bank</span>
              <input
                name="bankName"
                type="text"
                value={form.bankName}
                onChange={(e) => setField('bankName', e.target.value)}
                style={inputStyle}
                placeholder="Bank name"
              />
            </label>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <label style={labelStyle}>
              <span>Address of Bank</span>
              <input
                name="bankAddress"
                type="text"
                value={form.bankAddress}
                onChange={(e) => setField('bankAddress', e.target.value)}
                style={inputStyle}
                placeholder="Branch address"
              />
            </label>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>IFSC Code</span>
              <input
                name="ifsc"
                type="text"
                value={form.ifsc}
                onChange={(e) => setField('ifsc', e.target.value.toUpperCase())}
                onBlur={() => markTouched('ifsc')}
                aria-invalid={touched.ifsc && !!errors.ifsc}
                style={inputStyle}
                placeholder="e.g., HDFC0001234"
              />
              {touched.ifsc && errors.ifsc && (
                <span role="alert" style={errorStyle}>{errors.ifsc}</span>
              )}
            </label>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>
                Account Number <span aria-hidden="true" style={{ color: 'var(--error)' }}>*</span>
              </span>
              <input
                name="accountNumber"
                type="text"
                value={form.accountNumber}
                onChange={(e) => setField('accountNumber', e.target.value)}
                onBlur={() => markTouched('accountNumber')}
                aria-invalid={touched.accountNumber && !!errors.accountNumber}
                style={inputStyle}
                placeholder="XXXXXXXXXXXX"
                required
              />
              {touched.accountNumber && errors.accountNumber && (
                <span role="alert" style={errorStyle}>{errors.accountNumber}</span>
              )}
            </label>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <label style={labelStyle}>
              <span>Type of Account</span>
              <select
                name="accountType"
                value={form.accountType}
                onChange={(e) => setField('accountType', e.target.value)}
                style={inputStyle}
              >
                <option value="">Select…</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: 8 }}>
          <Button variant="subtle" onClick={() => setForm(initialState)}>Reset</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
          <ExportPdfButton
            targetRef={exportScopeRef}
            filename={`OnboardingForm-${(form.firstName || 'User')}-${new Date().toISOString().slice(0,10)}.pdf`}
            label="Export PDF"
            style={{
              background: 'var(--btn-bg)',
              color: 'var(--btn-fg)',
              border: '1px solid var(--btn-border)',
              minWidth: 140,
              padding: '10px 16px',
              borderRadius: 10,
              fontWeight: 600,
            }}
            onExport={async ({ success, blob, dataUrl, error }) => {
              const DIAG = (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV) !== 'production';
              const log = (...args) => { if (DIAG) try { console.debug('[OnboardingForm:onExport]', ...args); } catch {} };

              try {
                const email = (() => {
                  try {
                    const raw = window.localStorage.getItem('lms_auth');
                    const session = raw ? JSON.parse(raw) : null;
                    return session?.user?.email || 'anonymous';
                  } catch {
                    return 'anonymous';
                  }
                })();
                const title = `Onboarding Form – ${(form.firstName || '').trim() || 'User'} – ${new Date().toLocaleDateString()}`;

                let saved = null;
                if (blob instanceof Blob) {
                  saved = submitDocument({ title, blob, type: 'onboarding', status: 'submitted', submittedBy: email });
                } else if (typeof dataUrl === 'string' && dataUrl.startsWith('data:application/pdf')) {
                  saved = submitDocument({ title, blob: dataUrl, type: 'onboarding', status: 'submitted', submittedBy: email });
                }

                if (saved) {
                  push?.({ type: 'success', message: 'Onboarding PDF submitted to Admin Inbox.' });
                } else if (success && !saved) {
                  // Consistent with Documents: export succeeded, but we didn't get a storable payload
                  push?.({ type: 'info', message: 'PDF downloaded but could not be attached to Admin Inbox.' });
                } else {
                  push?.({ type: 'error', message: `PDF export failed${error ? ` (${error})` : ''}.` });
                  log('Export failed details:', { success, error });
                }
              } catch (e) {
                log('Unexpected error while submitting PDF', e);
                push?.({ type: 'error', message: 'Unexpected error while submitting PDF.' });
              }
            }}
          />
        </div>
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Submission Successful">
        <p style={{ marginTop: 0 }}>
          Your onboarding details have been captured locally. No data was sent to a backend.
        </p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            padding: 12,
            borderRadius: 10,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
{JSON.stringify(form, null, 2)}
        </pre>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </div>
      </Modal>
    </main>
  );
}
