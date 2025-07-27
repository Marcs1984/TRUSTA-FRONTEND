import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Builder from './builder.jsx'
import Contractor from './contractor.jsx'
import Client from './client.jsx'

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/builder">Builder</Link> | 
        <Link to="/contractor">Contractor</Link> | 
        <Link to="/client">Client</Link>
      </nav>
      <Routes>
        <Route path="/builder" element={<Builder />} />
        <Route path="/contractor" element={<Contractor />} />
        <Route path="/client" element={<Client />} />
      </Routes>
    </Router>
  )
}

export default App
