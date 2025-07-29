
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import BuilderLogin from './pages/BuilderLogin.jsx';
import ContractorLogin from './pages/ContractorLogin.jsx';
import ClientLogin from './pages/ClientLogin.jsx';

import BuilderDashboard from './pages/BuilderDashboard.jsx';
import ContractorDashboard from './pages/ContractorDashboard.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/builder-login">Builder Login</Link> |{" "}
        <Link to="/contractor-login">Contractor Login</Link> |{" "}
        <Link to="/client-login">Client Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder-login" element={<BuilderLogin />} />
        <Route path="/contractor-login" element={<ContractorLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/builder" element={<BuilderDashboard />} />
        <Route path="/contractor" element={<ContractorDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
