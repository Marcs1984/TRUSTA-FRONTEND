import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BRAND_DARK = '#0b4a6f';
const ORANGE = '#F7931E';
const LIGHT_ORANGE = '#FFF4E5';

/* ===================== Page ===================== */
export default function Pricing() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const role = (params.get('role') || 'builder').toLowerCase();
  const active = ['builder', 'contractor', 'client'].includes(role) ? role : 'builder';
  const entity = active === 'contractor' ? 'jobs' : 'projects';

  const titles = {
    builder: 'Choose Your Builder Plan',
    contractor: 'Choose Your Contractor Plan',
    client: 'Choose Your Client Plan',
  };

  const loginPath = {
    builder: '/builder-login',
    contractor: '/contractor-login',
    client: '/client-login',
  }[active];

  // NEW: where to land after signup/demo
  const dashboardPath = {
    builder: '/builder-dashboard',
    contractor: '/contractor-dashboard',
    client: '/client-dashboard',
  }[active];

  const plansByRole = {
    builder: [
      {
        name: 'Starter',
        price: '$99',
        per: '/month',
        features: [
          'Up to 5 active projects',
          'Seats included: 3',
          'Roles: Owner/Admin, Project Manager, Site Supervisor',
          'Basic escrow management',
          'Document storage (5GB)',
          'Email support',
        ],
      },
      {
        name: 'Professional',
        price: '$199',
        per: '/month',
        badge: 'Most Popular',
        featured: true,
        features: [
          'Up to 20 active projects',
          'Seats included: 10',
          'Roles: Owner/Admin, Contract Admin/QS, Project Manager, Site Supervisor, Finance/Accounts',
          'Advanced escrow & milestone schedules',
          'Document storage (50GB)',
          'Priority phone support',
        ],
      },
      {
        name: 'Enterprise',
        price: '$399',
        per: '/month',
        features: [
          'Unlimited projects',
          'Seats included: 30',
          'Roles: All + Compliance Officer',
          'Unlimited storage · Advanced reporting',
          'API · SSO-ready · White-label',
          '24/7 dedicated support',
        ],
      },
    ],

    contractor: [
      {
        name: 'Trade Lite',
        price: '$39',
        per: '/month',
        features: [
          'Up to 5 active jobs',
          'Seats included: 1',
          'Roles: Owner/Admin, Tradesperson',
          'Escrow payments',
          'Document upload (10GB)',
          'Basic compliance capture (ABN/licence/insurance)',
          'Email support',
        ],
      },
      {
        name: 'Trade Pro',
        price: '$89',
        per: '/month',
        badge: 'Most Popular',
        featured: true,
        features: [
          'Up to 15 active jobs',
          'Seats included: 5',
          'Roles: Owner/Admin, Project Manager, Supervisor, Tradesperson',
          'Priority payments',
          'Document upload (50GB)',
          'Compliance workflows (SWMS, inductions)',
          'Photo/file job logs',
          'Phone support',
        ],
      },
      {
        name: 'Trade Unlimited',
        price: '$199',
        per: '/month',
        features: [
          'Unlimited active jobs',
          'Seats included: 20',
          'Roles: Owner/Admin, PM, Supervisor, Tradesperson, Finance/Accounts',
          'Advanced analytics & reports',
          'Compliance automation (expiry alerts, site packs)',
          'Multi-user & multi-location',
          'API access · Priority support',
        ],
      },
    ],

    client: [
      {
        name: 'Basic',
        price: '$29',
        per: '/month',
        features: [
          'Up to 3 active projects',
          'Seats included: 2',
          'Roles: Owner, Approver',
          'Escrow protection',
          'Progress tracking',
          'Email notifications',
        ],
      },
      {
        name: 'Premium',
        price: '$79',
        per: '/month',
        badge: 'Popular',
        featured: true,
        features: [
          'Up to 10 active projects',
          'Seats included: 5',
          'Roles: Owner, Approver, Finance/Accounts',
          'Advanced escrow controls',
          'Project analytics · Milestone approvals',
          'Priority support',
        ],
      },
      {
        name: 'Enterprise',
        price: '$199',
        per: '/month',
        features: [
          'Unlimited projects',
          'Seats included: 20',
          'Roles: Owner, Approver, Finance/Accounts, Compliance Officer',
          'Custom workflows · Multi-location',
          'API integration',
          'Dedicated support',
        ],
      },
    ],
  };

  const plans = plansByRole[active];

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [form, setForm] = useState({});

  const openSignup = (planName) => {
    setSelectedPlan(planName);
    setForm({});
    setOpen(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // persist a lightweight session for the dashboard
    try {
      localStorage.setItem(
        'trusta_signup',
        JSON.stringify({ role: active, plan: selectedPlan, form })
      );
    } catch {}
    setOpen(false);
    // go straight to the dashboard (instead of login)
    navigate(dashboardPath);
  };

  return (
    <div style={{ padding: '48px 16px', maxWidth: 1180, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 8 }}>{titles[active]}</h1>
      <p style={{ textAlign: 'center', marginBottom: 24, color: '#4b5563' }}>
        Select the plan that best fits your {active} needs.
      </p>

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {plans.map((p) => (
          <PlanCard key={p.name} plan={p} onSelect={() => openSignup(p.name)} />
        ))}
      </div>

      {/* Notes + consultation CTA */}
      <div style={notesBox}>
        <div>
          <strong>“Active {entity}”</strong> means open at the same time. Extra seats <strong>+$10/user/month</strong>.
        </div>
        <button
          style={consultBtn}
          onClick={() => window.dispatchEvent(new Event('open-contact'))}
        >
          Book a consultation
        </button>
      </div>

      {open && (
        <SignupModal
          role={active}
          plan={selectedPlan}
          form={form}
          setForm={setForm}
          onChange={onChange}
          onClose={() => setOpen(false)}
          onSubmit={onSubmit}
          loginPath={loginPath}
          dashboardPath={dashboardPath} // NEW
        />
      )}
    </div>
  );
}

/* ===================== Plan Card ===================== */
function PlanCard({ plan, onSelect }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{
        ...card,
        ...(plan.featured ? featured : {}),
        ...(hover ? hoverCard : {}),
        cursor: 'pointer',
      }}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onSelect() : null)}
      role="button"
      aria-label={`Select ${plan.name} plan`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{plan.name}</h3>
        {plan.badge && <span style={badge}>{plan.badge}</span>}
      </div>

      <div style={priceRow}>
        <span style={price}>{plan.price}</span>
        <span style={per}>{plan.per}</span>
      </div>

      <ul style={list}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div style={{ ...btn, ...(hover ? btnHover : {}) }}>Select Plan</div>
    </div>
  );
}

/* ===================== Demo Helpers ===================== */
function getDemoData(role) {
  if (role === 'client') {
    return {
      clientFullName: 'Jordan Lee',
      clientCompanyName: 'TRUSTA PTY LTD',
      clientABN: '12345678901',
      clientAddress: '123 George St, Sydney NSW 2000',
      clientEmail: 'jordan@trusta.com',
      clientPhone: '0400 222 333',
    };
  }
  const licence = role === 'builder' ? 'NSW-BLD-123456' : 'NSW-CON-654321';
  return {
    companyLegalName: 'TRUSTA PTY LTD',
    companyTradingName: 'TRUSTA',
    companyABN: '12345678901',
    companyACN: '123456789',
    companyAddress: '123 George St, Sydney NSW 2000',
    companyEmail: 'hello@trusta.com',
    companyWebsite: 'https://trusta.com',
    companyTFN: '000000000',
    companyLicence: licence,
    companyPhone: '02 5550 1234',
    ownerFirst: 'Alex',
    ownerLast: 'Martin',
    ownerEmail: 'alex@trusta.com',
    ownerPhone: '0400 123 456',
    ownerLicence: role === 'builder' ? 'QBCC 123456' : 'Contractor Lic 765432',
  };
}

/* ===================== Modal ===================== */
function SignupModal({ role, plan, form, setForm, onChange, onClose, onSubmit, loginPath, dashboardPath }) {
  const heading =
    role === 'builder' ? 'Builder / Developer details'
    : role === 'contractor' ? 'Contractor details'
    : 'Client details';

  const roleIcon = role === 'builder' ? '🏗️' : role === 'contractor' ? '🛠️' : '🏡';
  const navigate = useNavigate();

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const fillDemo = () => setForm(getDemoData(role));

  const demoAndContinue = () => {
    const data = getDemoData(role);
    setForm(data);
    try {
      localStorage.setItem(
        'trusta_signup',
        JSON.stringify({ role, plan, form: data })
      );
    } catch {}
    onClose();
    // straight to dashboard instead of login
    navigate(dashboardPath);
  };

  const companySection =
    role === 'client'
      ? [
          { name: 'clientFullName', label: 'Full name (or Contact person)', req: true },
          { name: 'clientCompanyName', label: 'Company / Organisation (optional)' },
          { name: 'clientABN', label: 'ABN (optional)' },
          { name: 'clientAddress', label: 'Address', req: true },
          { name: 'clientEmail', label: 'Email', type: 'email', req: true },
          { name: 'clientPhone', label: 'Phone', type: 'tel', req: true },
        ]
      : [
          { name: 'companyLegalName', label: 'Company legal name', req: true },
          { name: 'companyTradingName', label: 'Trading name (optional)' },
          { name: 'companyABN', label: 'ABN', req: true },
          { name: 'companyACN', label: 'ACN (optional)' },
          { name: 'companyAddress', label: 'Company address', req: true },
          { name: 'companyEmail', label: 'Company email', type: 'email', req: true },
          { name: 'companyWebsite', label: 'Company website (optional)' },
          { name: 'companyTFN', label: 'Tax File Number (secure storage required)', placeholder: 'Optional for quote' },
          { name: 'companyLicence', label: 'Company licence number', req: role !== 'client' },
          { name: 'companyPhone', label: 'Company office number', type: 'tel' },
        ];

  const ownerSection =
    role === 'client'
      ? []
      : [
          { name: 'ownerFirst', label: 'Owner first name', req: true },
          { name: 'ownerLast', label: 'Owner last name', req: true },
          { name: 'ownerEmail', label: 'Owner email', type: 'email', req: true },
          { name: 'ownerPhone', label: 'Owner contact number', type: 'tel', req: true },
          { name: 'ownerLicence', label: 'Individual licence number(s) (optional)' },
        ];

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modalShell} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div style={modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={roleBubble}>{roleIcon}</div>
            <div>
              <div style={{ fontWeight: 900, letterSpacing: .2 }}>{heading}</div>
              <div style={{ opacity: .9, fontSize: 13 }}>
                Selected plan: <strong>{plan}</strong>
              </div>
            </div>
          </div>
          <button aria-label="Close" onClick={onClose} style={xBtn}>×</button>
        </div>

        {/* Demo action bar */}
        <div style={demoBar}>
          <div style={{ color: '#374151' }}>Just showing the flow? Quickly prefill with demo data.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" style={demoBtn} onClick={fillDemo}>Use demo data</button>
            <button type="button" style={demoBtnPrimary} onClick={demoAndContinue}>Demo & Continue</button>
          </div>
        </div>

        {/* Body */}
        <div style={modalBody}>
          <form onSubmit={onSubmit}>
            <Section title={role === 'client' ? 'Client details' : 'Company details'}>
              {companySection.map((f) => (
                <Field key={f.name} {...f} value={form[f.name] || ''} onChange={onChange} />
              ))}
            </Section>

            {ownerSection.length > 0 && (
              <Section title="Owner details">
                {ownerSection.map((f) => (
                  <Field key={f.name} {...f} value={form[f.name] || ''} onChange={onChange} />
                ))}
              </Section>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="button" onClick={onClose} style={closeBtn}>Cancel</button>
              <button type="submit" style={saveBtn}>Save & Continue</button>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, color: '#374151' }}>
              By continuing, you agree to secure handling of sensitive IDs (e.g., TFN/licences).
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===================== Small UI Helpers ===================== */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={sectionCard}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, value, onChange, type = 'text', req = false, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.2px' }}>
        {label}{req && <span style={{ color: '#dc2626' }}> *</span>}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        type={type}
        placeholder={placeholder || ''}
        required={req}
        style={{ ...input, ...(focus ? inputFocus : {}) }}
      />
    </label>
  );
}

/* ===================== Styles ===================== */
const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  textAlign: 'left',
  border: '1px solid rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow .2s ease, transform .2s ease, border-color .2s ease, background-color .2s ease',
};

const featured = { border: `2px solid ${BRAND_DARK}` };

const hoverCard = {
  border: `2px solid ${ORANGE}`,
  background: LIGHT_ORANGE,
  boxShadow: '0 16px 36px rgba(0,0,0,0.20)',
  transform: 'translateY(-4px) scale(1.01)',
};

const priceRow = { marginTop: 8, marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 6 };
const price = { fontSize: 28, fontWeight: 900, color: BRAND_DARK };
const per = { color: '#6b7280', fontWeight: 700 };

const list = { listStyle: 'none', padding: 0, margin: '8px 0 16px', color: '#374151', flex: 1 };

const btn = {
  alignSelf: 'start',
  padding: '12px 16px',
  borderRadius: 10,
  textDecoration: 'none',
  background: BRAND_DARK,
  color: '#fff',
  fontWeight: 800,
  transition: 'background-color .15s ease, transform .15s ease',
};

const btnHover = { background: ORANGE, color: '#111827', transform: 'translateY(-1px)' };

const badge = {
  fontSize: 12,
  fontWeight: 800,
  background: '#fde68a',
  color: '#1f2937',
  padding: '4px 8px',
  borderRadius: 8,
};

const notesBox = {
  marginTop: 18,
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: '14px 16px',
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
};

const consultBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  background: '#1f2937',
  color: '#fff',
  fontWeight: 900,
  cursor: 'pointer',
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  zIndex: 1000,
};

const modalShell = {
  width: 'min(960px, 100%)',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
  background: '#fff',
};

const modalHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  color: '#fff',
  background: `linear-gradient(90deg, ${BRAND_DARK} 0%, ${BRAND_DARK} 60%, ${ORANGE})`,
};

const roleBubble = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(255,255,255,0.15)',
  fontSize: 20,
};

const xBtn = {
  appearance: 'none',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: 10,
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1,
  color: '#111827',
  background: '#ffffff',
  cursor: 'pointer',
};

const demoBar = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 14px',
  background: LIGHT_ORANGE,
  borderBottom: `1px solid ${ORANGE}`,
};

const demoBtn = {
  padding: '8px 12px',
  borderRadius: 10,
  border: `1px solid ${ORANGE}`,
  background: '#fff',
  color: '#111827',
  fontWeight: 800,
  cursor: 'pointer',
};

const demoBtnPrimary = {
  padding: '8px 12px',
  borderRadius: 10,
  border: 'none',
  background: ORANGE,
  color: '#111827',
  fontWeight: 900,
  cursor: 'pointer',
};

const modalBody = { padding: 18, maxHeight: '75vh', overflowY: 'auto', background: '#fff' };

const sectionCard = {
  background: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: 12,
};

const input = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  outline: 'none',
  background: '#fff',
  transition: 'box-shadow .15s ease, border-color .15s ease',
};

const inputFocus = {
  borderColor: ORANGE,
  boxShadow: `0 0 0 3px ${LIGHT_ORANGE}`,
};

const closeBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  background: '#eee',
  color: '#111827',
  fontWeight: 800,
  cursor: 'pointer',
};

const saveBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  background: ORANGE,
  color: '#111827',
  fontWeight: 900,
  cursor: 'pointer',
};

