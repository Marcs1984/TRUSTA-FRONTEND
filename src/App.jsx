import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home.jsx';
import BuilderLogin from './pages/BuilderLogin.jsx';
import ContractorLogin from './pages/ContractorLogin.jsx';
import ClientLogin from './pages/ClientLogin.jsx';
import BuilderDashboard from './pages/BuilderDashboard.jsx';
import ContractorDashboard from './pages/ContractorDashboard.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import About from './pages/About.jsx';
import Pricing from './pages/Pricing.jsx';
import Features from './pages/Features.jsx';
import Signup from './pages/Signup.jsx'; // <-- NEW

// Styles
import './index.css';
import './style.css';

function App() {
  const [loginType, setLoginType] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Contact form state
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    companyType: '',
    message: '',
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((c) => ({ ...c, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, company, jobTitle, phone, companyType, message } = contact;
    if (!firstName || !lastName || !email || !company || !jobTitle || !phone || !companyType || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    // TODO: send to your backend/email service here
    alert('Thanks! Your message has been sent.');
    setContact({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      jobTitle: '',
      phone: '',
      companyType: '',
      message: '',
    });
    closeContact();
  };

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
    window.location.href = routes[loginType];
    closeLogin();
  };

  const handleDemoLogin = () => {
    const routes = {
      builder: '/builder-dashboard',
      contractor: '/contractor-dashboard',
      client: '/client-dashboard',
    };
    window.location.href = routes[loginType];
    closeLogin();
  };

  return (
    <Router>
      <Header onOpenLogin={openLogin} onOpenContact={openContact} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Basic pages */}
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/signup" element={<Signup />} /> {/* <-- NEW */}

        {/* Login pages */}
        <Route path="/builder-login" element={<BuilderLogin />} />
        <Route path="/contractor-login" element={<ContractorLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />

        {/* Dashboards */}
        <Route path="/builder" element={<BuilderDashboard />} />
        <Route path="/contractor" element={<ContractorDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/builder-dashboard" element={<BuilderDashboard />} />
        <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />

        {/* Demo alias */}
        <Route path="/demo-dashboard" element={<BuilderDashboard />} />
      </Routes>

      {/* Global Login Modal */}
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

      {/* Global Contact Modal – detailed form */}
      {showContact && (
        <div style={overlayStyle} onClick={closeContact}>
          <div
            style={{
              ...modalStyle,
              maxWidth: 820,
              width: '94%',
              textAlign: 'left',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ ...titleStyle, marginBottom: 10, textAlign: 'left' }}>
              Please note: all fields are required
            </h2>

            <form onSubmit={handleContactSubmit}>
              {/* First/Last */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                    FIRST NAME<span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    name="firstName"
                    value={contact.firstName}
                    onChange={handleContactChange}
                    placeholder="First name"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                    LAST NAME<span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    name="lastName"
                    value={contact.lastName}
                    onChange={handleContactChange}
                    placeholder="Last name"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Company Email */}
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                  COMPANY EMAIL<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  placeholder="name@company.com"
                  style={inputStyle}
                />
              </div>

              {/* Company */}
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                  COMPANY<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  name="company"
                  value={contact.company}
                  onChange={handleContactChange}
                  placeholder="Your company"
                  style={inputStyle}
                />
              </div>

              {/* Job Title / Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                    JOB TITLE<span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    name="jobTitle"
                    value={contact.jobTitle}
                    onChange={handleContactChange}
                    placeholder="Job title"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                    PHONE<span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    name="phone"
                    value={contact.phone}
                    onChange={handleContactChange}
                    placeholder="Phone"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Company Type */}
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                  COMPANY TYPE<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  name="companyType"
                  value={contact.companyType}
                  onChange={handleContactChange}
                  style={selectStyle}
                >
                  <option value="">Please Select</option>
                  <option>Builder / General Contractor</option>
                  <option>Subcontractor</option>
                  <option>Owner / Client</option>
                  <option>Government / Public Sector</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: .3 }}>
                  HOW CAN WE HELP?<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={contact.message}
                  onChange={handleContactChange}
                  rows={5}
                  placeholder="Tell us a little about your project or question…"
                  style={textareaStyle}
                />
              </div>

              {/* Privacy + Actions */}
              <p style={{ fontSize: 14, color: '#374151', marginTop: 12 }}>
                By submitting this form, I accept and acknowledge TRUSTA’s{' '}
                <a href="/privacy" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>.
              </p>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
                <button type="submit" style={buttonStyle}>SEND</button>
                <button type="button" style={closeBtnStyle} onClick={closeContact}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Router>
  );
}

// Styles
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

const selectStyle = { ...inputStyle, appearance: 'none', backgroundColor: '#fff' };

const textareaStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  resize: 'vertical',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1f2937',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const closeBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#eee',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default App;
