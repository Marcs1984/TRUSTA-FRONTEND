// src/pages/Signup.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div style={{ padding: '60px 16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 28 }}>Choose your role</h1>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          justifyItems: 'center',
        }}
      >
        <Link to="/builder-login" style={btn} aria-label="Sign up as Builder">Builder / Developer</Link>
        <Link to="/contractor-login" style={btn} aria-label="Sign up as Contractor">Contractor</Link>
        <Link to="/client-login" style={btn} aria-label="Sign up as Client">Client / Homeowner</Link>
      </div>
    </div>
  );
}

const btn = {
  display: 'inline-block',
  width: '100%',
  maxWidth: 360,
  textAlign: 'center',
  padding: '14px 18px',
  borderRadius: 12,
  textDecoration: 'none',
  background: '#0b4a6f',
  color: '#fff',
  fontWeight: 700,
  boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
};
