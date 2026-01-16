// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ onOpenLogin, onOpenContact }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showSignUpMenu, setShowSignUpMenu] = useState(false);

  const loginMenuRef = useRef(null);
  const signUpMenuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      const inLogin = loginMenuRef.current?.contains(e.target);
      const inSign = signUpMenuRef.current?.contains(e.target);
      if (!inLogin && !inSign) {
        setShowLoginMenu(false);
        setShowSignUpMenu(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    setShowLoginMenu(false);
    setShowSignUpMenu(false);
  }, [location.pathname]);

  const openRole = (role) => {
    setShowLoginMenu(false);
    onOpenLogin?.(role);
  };

  const goFeatures = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("features");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate("/features");
  };

  const goRolePricing = (role) => {
    setShowSignUpMenu(false);
    navigate(`/pricing?role=${role}`);
  };

  const onHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const HEADER_HEIGHT = "clamp(150px, 18vw, 240px)";
  const PADDING_X = 24;

  return (
    <div
      style={{
        position: "relative",
        height: HEADER_HEIGHT,
        backgroundImage: 'url("/header-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        .nav-btn {
          background-color:#1f2937;
          color:#fff;
          padding:10px 16px;
          border-radius:8px;
          font-weight:600;
          border:none;
          cursor:pointer;
          transition: box-shadow .15s ease, transform .05s ease;
        }

        /* 🔥 STRONGER WARNING ORANGE GLOW */
        .nav-btn:hover,
        .nav-btn:focus-visible {
          box-shadow:
            0 0 0 2px rgba(255, 149, 0, 0.55),
            0 0 16px 6px rgba(255, 149, 0, 0.75);
          outline: none;
        }

        .nav-btn:active {
          transform: translateY(1px);
          box-shadow:
            0 0 0 2px rgba(255, 149, 0, 0.65),
            0 0 10px 4px rgba(255, 149, 0, 0.85);
        }

        .menu-panel {
          position:absolute;
          top:48px;
          right:0;
          background:#1f2937;
          color:#fff;
          border-radius:8px;
          padding:6px;
          min-width:220px;
          z-index:1000;
          display:flex;
          flex-direction:column;
          box-shadow: 0 10px 20px rgba(0,0,0,0.18);
        }

        .menu-item {
          background:transparent;
          border:none;
          text-align:left;
          padding:10px 12px;
          border-radius:6px;
          cursor:pointer;
          color:#fff;
          font-weight:600;
          transition: box-shadow .15s ease, background .15s ease, color .15s ease;
        }

        .menu-item:hover,
        .menu-item:focus-visible {
          background:#111827;
          box-shadow:
            0 0 0 2px rgba(255, 149, 0, 0.55),
            0 0 16px 6px rgba(255, 149, 0, 0.75);
          outline: none;
        }
      `}</style>

      <div
        style={{
          height: "100%",
          paddingLeft: PADDING_X,
          paddingRight: PADDING_X,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div style={{ marginTop: 10 }}>
          <Link to="/" onClick={onHomeClick}>
            <img
              src="/logo-trusta.png"
              alt="Trusta"
              style={{
                width: "clamp(240px, 28vw, 460px)",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        {/* Nav */}
        <div
          style={{
            marginTop: "auto",
            paddingBottom: 10,
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button className="nav-btn" onClick={() => navigate("/")}>Home</button>
          <button className="nav-btn" onClick={() => navigate("/pricing")}>Pricing</button>
          <button className="nav-btn" onClick={() => navigate("/about")}>About Us</button>
          <button className="nav-btn" onClick={goFeatures}>Features</button>

          {/* Sign Up */}
          <div style={{ position: "relative" }} ref={signUpMenuRef}>
            <button className="nav-btn" onClick={() => setShowSignUpMenu(v => !v)}>
              Sign Up ▾
            </button>
            {showSignUpMenu && (
              <div className="menu-panel">
                <button className="menu-item" onClick={() => goRolePricing("builder")}>Builder</button>
                <button className="menu-item" onClick={() => goRolePricing("contractor")}>Contractor</button>
                <button className="menu-item" onClick={() => goRolePricing("client")}>Client / Developer</button>
              </div>
            )}
          </div>

          {/* Login */}
          <div style={{ position: "relative" }} ref={loginMenuRef}>
            <button className="nav-btn" onClick={() => setShowLoginMenu(v => !v)}>
              Login ▾
            </button>
            {showLoginMenu && (
              <div className="menu-panel">
                <button className="menu-item" onClick={() => openRole("builder")}>Builder</button>
                <button className="menu-item" onClick={() => openRole("contractor")}>Contractor</button>
                <button className="menu-item" onClick={() => openRole("client")}>Client / Developer</button>
                <div style={{ height: 1, background: "#e5e7eb", margin: "6px 0" }} />
                <button className="menu-item" onClick={() => navigate("/demo-dashboard")}>
                  Try Demo
                </button>
              </div>
            )}
          </div>

          <button className="nav-btn" onClick={onOpenContact}>Contact Us</button>
        </div>
      </div>
    </div>
  );
}

export default Header;










