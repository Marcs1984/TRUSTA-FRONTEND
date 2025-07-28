import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import BuilderLogin from './pages/BuilderLogin.jsx';
import ContractorLogin from './pages/ContractorLogin.jsx';
import ClientLogin from './pages/ClientLogin.jsx';

import BuilderSignup from './pages/BuilderSignup.jsx';
import ContractorSignup from './pages/ContractorSignup.jsx';
import ClientSignup from './pages/ClientSignup.jsx';

import BuilderDashboard from './pages/BuilderDashboard.jsx';
import ContractorDashboard from './pages/ContractorDashboard.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/builder-login">Builder Login</Link> |{" "}
        <Link to="/contractor-login">Contractor Login</Link> |{" "}
        <Link to="/client-login">Client Login</Link> |{" "}
        <Link to="/signup/builder">Builder Signup</Link> |{" "}
        <Link to="/signup/contractor">Contractor Signup</Link> |{" "}
        <Link to="/signup/client">Client Signup</Link>
      </nav>

      <Routes>
        <Route path="/builder-login" element={<BuilderLogin />} />
        <Route path="/contractor-login" element={<ContractorLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />

        <Route path="/signup/builder" element={<BuilderSignup />} />
        <Route path="/signup/contractor" element={<ContractorSignup />} />
        <Route path="/signup/client" element={<ClientSignup />} />

        <Route path="/builder" element={<BuilderDashboard />} />
        <Route path="/contractor" element={<ContractorDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
