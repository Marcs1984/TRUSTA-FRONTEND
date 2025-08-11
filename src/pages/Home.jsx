import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const openLogin = (type) => {
    setLoginType(type);
    setEmail('');
    setPassword('');
  };

  const closeLogin = () => {
    setLoginType('');
    setEmail('');
    setPassword('');
  };

  const openContact = () => setShowContact(true);
  const closeContact = () => setShowContact(false);

  const handleConfirmLogin = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    const routes = {
      builder: '/builder-dashboard',
      contractor: '/contractor-dashboard',
      client: '/client-dashboard',
    };
    navigate(routes[loginType]);
    closeLogin();
  };

  const handleDemoLogin = () => navigate('/demo-dashboard');

  return (
    <div>
      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Hold Funds. Release Confidence.
        </h1>
        <p style={{ fontSize: '1.2rem', margin: '10px 0 20px' }}>
          The secure construction escrow platform.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/signup" style={ctaLinkStyle}>Sign Up</Link>
          <button
            style={{
              backgroundColor: '#ff6600',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={handleDemoLogin}
          >
            Try Demo
          </button>
        </div>
      </section>

      {/* TRUSTA INTRO */}
      <section style={cardStyle}>
        <div style={brandRowStyle}>
          <span style={wordmarkStyle}>TRUSTA</span>
          <sup style={rStyle}>®</sup>
        </div>

        <h2 style={h2Style}>Hold Funds. Release Confidence.</h2>

        <p style={pBold}>
          TRUSTA is the first fully integrated construction escrow platform designed to protect every dollar in a project from small subcontractor jobs to multi-million-dollar government contracts. We lock 100% of project funds upfront so no one starts work without guaranteed payment.
        </p>

        <p style={pBold}>
          In an industry where disputes, delays, and unpaid invoices are common, TRUSTA introduces a system where funds only move when milestones are verified. Contracts are instant, variations become milestones, and compliance checks are built in. No payment games. No grey areas.
        </p>

        <p style={pBold}>
          Whether you are a sole trader, a national builder, or a government department, TRUSTA creates a transparent, secure, and efficient payment process that works for everyone, protecting not only workers but also builders, clients, and the public.
        </p>

        <p style={{ ...pBold, marginBottom: 0 }}>
          By transforming how construction payments are handled, TRUSTA sets a new standard for fairness, accountability, and trust across the industry. It safeguards people, protects budgets, and ensures every project is delivered with confidence.
        </p>
      </section>

      {/* FEATURES — IMAGES ONLY, PLAIN WHITE */}
      <section style={featuresWrap}>
        <div style={featuresInner}>
          <h2 style={featuresHeading}>Platform Features</h2>

          <div style={featuresGrid}>
            {featureImgs.map((src, i) => (
              <img key={i} src={src} alt={`Feature ${i + 1}`} style={featureImg} />
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {loginType && (
        <div style={overlayStyle} onClick={closeLogin}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={titleStyle}>
              {`${loginType.charAt(0).toUpperCase() + loginType.slice(1)} Login`}
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={buttonStyle} onClick={handleConfirmLogin}>Confirm</button>
              <button style={buttonStyle} onClick={handleDemoLogin}>Try Demo</button>
            </div>

            <button style={closeBtnStyle} onClick={closeLogin}>Close</button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div style={overlayStyle} onClick={closeContact}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={titleStyle}>Contact Modal</h2>
            <button style={buttonStyle} onClick={closeContact}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Styles ===== */
const cardStyle = {
  backgroundColor: '#fff',
  borderLeft: '6px solid #F7931E',
  borderRadius: '8px',
  padding: '40px 50px',
  maxWidth: '1000px',
  margin: '50px auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  lineHeight: 1.6,
};

const brandRowStyle = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '6px',
  marginBottom: '8px',
};

const wordmarkStyle = {
  fontSize: '2.2rem',
  fontWeight: 800,
  color: '#1f2937',
  WebkitTextStroke: '2px #F7931E',
  textShadow:
    '1px 0 #F7931E, -1px 0 #F7931E, 0 1px #F7931E, 0 -1px #F7931E',
  letterSpacing: '1px',
  lineHeight: 1,
};

const rStyle = {
  fontSize: '0.9rem',
  fontWeight: 800,
  color: '#1f2937',
  position: 'relative',
  top: '-0.6em',
};

const h2Style = {
  color: '#F7931E',
  fontSize: '1.8rem',
  fontWeight: 800,
  margin: '6px 0 18px',
};

const pBold = {
  fontWeight: 600,
  marginBottom: '18px',
};

/* Features (images only) */
const featuresWrap = {
  background: '#fff',
  padding: '70px 20px',
  marginTop: '70px',
};

const featuresInner = {
  maxWidth: '1300px',
  margin: '0 auto',
};

const featuresHeading = {
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 800,
  marginBottom: '36px',
  color: '#111827',
};

const featuresGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '40px',
  alignItems: 'center',
  justifyItems: 'center',
};

const featureImg = {
  width: '100%',
  maxWidth: '380px',
  height: 'auto',
  display: 'block',
};

const featureImgs = [
  '/TRUSTA-ICONS/1.png',
  '/TRUSTA-ICONS/2.png',
  '/TRUSTA-ICONS/3.png',
  '/TRUSTA-ICONS/4.png',
  '/TRUSTA-ICONS/5.png',
  '/TRUSTA-ICONS/6.png',
];

/* Modal styles */
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '30px 40px',
  borderRadius: '12px',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
  minWidth: '350px',
};

const titleStyle = {
  marginBottom: '20px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1f2937',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const ctaLinkStyle = {
  ...buttonStyle,
  display: 'inline-block',
  textDecoration: 'none',
  textAlign: 'center',
};

const closeBtnStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#eee',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default Home;

