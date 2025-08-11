import React, { useState, useEffect, useRef } from 'react';

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end gap-4 p-4 relative z-50 pointer-events-auto">
      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded font-semibold pointer-events-auto z-50"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          Login
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg flex flex-col z-50 pointer-events-auto">
            <button
              className="px-4 py-2 hover:bg-gray-700 text-left pointer-events-auto"
              onClick={() => handleLogin('builder')}
            >
              Builder
            </button>
            <button
              className="px-4 py-2 hover:bg-gray-700 text-left pointer-events-auto"
              onClick={() => handleLogin('contractor')}
            >
              Contractor
            </button>
            <button
              className="px-4 py-2 hover:bg-gray-700 text-left pointer-events-auto"
              onClick={() => handleLogin('client')}
            >
              Client
            </button>
          </div>
        )}
      </div>

      <button
        className="bg-gray-800 text-white px-4 py-2 rounded font-semibold pointer-events-auto z-50"
        onClick={onOpenContact}
      >
        Contact Us
      </button>
    </div>
  );
}

export default Navbar;

