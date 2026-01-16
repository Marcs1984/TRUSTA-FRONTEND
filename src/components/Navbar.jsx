import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar({ onOpenLogin, onOpenContact }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogin = (type) => {
    onOpenLogin(type);
    setShowDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#0b1e33] relative z-50">
      {/* Left side: Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/logo-trusta.png"
          alt="TRUSTA Logo"
          className="h-12 w-auto"
        />
        <span className="text-white font-extrabold text-xl tracking-wide">
          TRUSTA
        </span>
      </Link>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded font-semibold"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Login ▾
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg flex flex-col">
              <button
                className="px-4 py-2 hover:bg-gray-700 text-left"
                onClick={() => handleLogin("builder")}
              >
                Builder
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-700 text-left"
                onClick={() => handleLogin("contractor")}
              >
                Contractor
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-700 text-left"
                onClick={() => handleLogin("client")}
              >
                Client
              </button>
            </div>
          )}
        </div>

        <button
          className="bg-gray-800 text-white px-4 py-2 rounded font-semibold"
          onClick={onOpenContact}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}

export default Navbar;
