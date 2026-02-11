// C:\TRUSTA-FRONTEND\src\context\AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider holds the "current user session" for the whole app.
 * Keep it simple: user + login/logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Call this after a successful login (or demo login)
  const login = (userData) => {
    // userData should be a small object like:
    // { role: 'builder', displayName: 'Acme Builders', email: 'x@y.com' }
    setUser(userData || null);
  };

  // Call this when logging out
  const logout = () => setUser(null);

  // Memo keeps the object stable (prevents unnecessary re-renders)
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth() lets any component access { user, login, logout }.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return ctx;
}
