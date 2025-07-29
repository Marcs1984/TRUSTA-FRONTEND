
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Hold Funds. Release Confidence.
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        The secure construction escrow platform.
      </p>
      <button
        style={{
          fontSize: '1rem',
          padding: '12px 24px',
          backgroundColor: '#111827',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/builder-login')}
      >
        Try Demo
      </button>
    </div>
  );
}

export default Home;
