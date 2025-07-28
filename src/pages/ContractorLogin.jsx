
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContractorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, loginPassword) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        navigate('/contractor');
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Contractor Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-3"
          >
            Login
          </button>
        </form>
        <button
          onClick={() =>
            handleLogin('contractor@demo.com', 'contractor123')
          }
          className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900"
        >
          Demo Login
        </button>
      </div>
    </div>
  );
};

export default ContractorLogin;
