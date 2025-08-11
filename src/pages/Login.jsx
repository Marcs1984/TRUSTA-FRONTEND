import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    position: '',
    twofa: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (data = formData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', data);
      alert(response.data.message);
      console.log(response.data);
      // redirect or store role/position if needed
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  const handleDemoLogin = () => {
    const demo = {
      email: 'demo@trusta.com',
      password: 'password123',
      role: 'builder',
      position: 'owner',
      twofa: '000000',
    };
    handleSubmit(demo);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 mb-2 w-full"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
      />
      <input
        className="border p-2 mb-4 w-full"
        type="text"
        name="twofa"
        placeholder="2FA Code"
        value={formData.twofa}
        onChange={handleChange}
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => handleSubmit()}
        >
          Login
        </button>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={handleDemoLogin}
        >
          Demo Login
        </button>
      </div>
    </div>
  );
};

export default Login;
