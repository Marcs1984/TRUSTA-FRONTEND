import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'client',
          position: 'owner',
          twofa: '333333'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/client');
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleDemoLogin = () => {
    setEmail('client@trusta.com');
    setPassword('clientpass');
    handleLogin();
  };

  return (
    <div>
      <h2>Client Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleDemoLogin}>Demo Login</button>
    </div>
  );
}
