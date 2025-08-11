import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ onOpenLogin, onOpenContact }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showSignUpMenu, setShowSignUpMenu] = useState(false);

  const loginMenuRef = useRef(null);
  const signUpMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      const inLogin = loginMenuRef.current?.contains(e.target);
      const inSign  = signUpMenuRef.current?.contains(e.target);
      if (!inLogin && !inSign) {
        setShowLoginMenu(false);
        setShowSignUpMenu(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowLoginMenu(false);
    setShowSignUpMenu(false);
  }, [location.pathname]);

  const openRole = (role) => {
    setShowLoginMenu(false);
    onOpenLogin(role);
  };

  const goFeatures = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('features');
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    navigate('/features');
  };

  const goRolePricing = (role) => {
    setShowSignUpMenu(false);
    navigate(`/pricing?role=${role}`);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '300px',
        backgroundImage: 'url("/header-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '0 60px',
      }}
    >
      <style>{`
        .nav-btn:hover { outline: 2px solid #F7931E; outline-offset: 0; }
        .menu-item:hover { outline: 2px solid #F7931E; outline-offset: 0; background: #f9fafb; color:#111827; }
      `}</style>

      {/* Logo -> Home */}
      <img
        src="/TRUSTA_logo_transparent.png"
        alt="TRUSTA Logo"
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '10px',
          left: '60px',
          height: '320px',
          width: 'auto',
          objectFit: 'contain',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />

      {/* Primary navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '60px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button className="nav-btn" style={navBtn} onClick={() => navigate('/')}>Home</button>
        <button className="nav-btn" style={navBtn} onClick={() => navigate('/pricing')}>Pricing</button>
        <button className="nav-btn" style={navBtn} onClick={() => navigate('/about')}>About Us</button>
        <button className="nav-btn" style={navBtn} onClick={goFeatures}>Features</button>

        {/* Sign Up dropdown */}
        <div style={{ position: 'relative' }} ref={signUpMenuRef}>
          <button
            className="nav-btn"
            style={navBtn}
            onClick={(e) => { e.stopPropagation(); setShowSignUpMenu(v => !v); }}
            aria-expanded={showSignUpMenu}
            aria-haspopup="true"
          >
            Sign Up ▾
          </button>

          {showSignUpMenu && (
            <div style={menuStyle} role="menu" aria-label="Sign up menu">
              <button className="menu-item" style={menuItemStyle} onClick={() => goRolePricing('builder')}>
                Builder / Developer
              </button>
              <button className="menu-item" style={menuItemStyle} onClick={() => goRolePricing('contractor')}>
                Contractor
              </button>
              <button className="menu-item" style={menuItemStyle} onClick={() => goRolePricing('client')}>
                Client / Homeowner
              </button>
            </div>
          )}
        </div>

        {/* Login dropdown */}
        <div style={{ position: 'relative' }} ref={loginMenuRef}>
          <button
            className="nav-btn"
            style={navBtn}
            onClick={(e) => { e.stopPropagation(); setShowLoginMenu(v => !v); }}
            aria-expanded={showLoginMenu}
            aria-haspopup="true"
          >
            Login ▾
          </button>

          {showLoginMenu && (
            <div style={menuStyle} role="menu" aria-label="Login menu">
              <button className="menu-item" style={menuItemStyle} onClick={() => openRole('builder')}>Builder</button>
              <button className="menu-item" style={menuItemStyle} onClick={() => openRole('contractor')}>Contractor</button>
              <button className="menu-item" style={menuItemStyle} onClick={() => openRole('client')}>Client</button>
              <div style={menuDivider} />
              <button className="menu-item" style={menuItemStyle} onClick={() => navigate('/demo-dashboard')}>Try Demo</button>
            </div>
          )}
        </div>

        <button className="nav-btn" style={navBtn} onClick={onOpenContact}>Contact Us</button>
      </div>
    </div>
  );
}

const navBtn = {
  backgroundColor: '#1f2937',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '8px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.15s ease',
};

const menuStyle = {
  position: 'absolute',
  top: '48px',
  right: 0,
  background: '#1f2937',
  color: '#fff',
  borderRadius: '8px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  padding: '6px',
  minWidth: '220px',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
};

const menuItemStyle = {
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  padding: '10px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: '#ffffff',
  fontWeight: 600,
  transition: 'background 0.15s ease, color 0.15s ease',
};

const menuDivider = { height: '1px', background: '#e5e7eb', margin: '6px 0' };

export default Header;
