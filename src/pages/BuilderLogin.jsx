import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function BuilderLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) return alert('Enter email and password');

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'builder',
          position: 'owner',
          twofa: '000000',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(data.message || 'Logged in');
        navigate('/builder-dashboard');
      } else {
        alert(data.detail || data.error || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleDemoLogin = () => {
    navigate('/builder-dashboard');
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={title}>Builder Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={primary}>Login</button>
          <button type="button" style={secondary} onClick={handleDemoLogin}>
            Demo Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 14 }}>
          New here? <Link to="/signup" style={link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */
const wrap = { display: 'flex', justifyContent: 'center', padding: '40px 16px' };
const card = {
  width: '100%',
  maxWidth: 420,
  background: '#fff',
  padding: 24,
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
};
const title = { margin: 0, marginBottom: 16 };
const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
};
const baseBtn = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 700,
};
const primary = { ...baseBtn, background: '#0b4a6f', color: '#fff' };
const secondary = { ...baseBtn, background: '#e5e7eb', color: '#111827' };
const link = { color: '#0b4a6f', textDecoration: 'underline' };
