import React, { useState } from 'react';
import axiosInstance from '../auth/axiosInstance';
import { useHistory } from 'react-router-dom';
import './Register.css'; // Ensure you have a CSS file for styling

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/api/auth/register', { email, password });
      history.push('/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="heading">CodeZoro</h1>
      <div className="register-box">
        <h1 className="register-title">Register</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button onClick={handleSubmit} className="register-button">Register</button>
        <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
      </div>
    </div>
  );
}

export default Register;