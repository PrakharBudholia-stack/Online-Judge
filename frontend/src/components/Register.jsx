import React, { useState } from 'react';
import axiosInstance from '../auth/axiosInstance';
import { useHistory } from 'react-router-dom';
import './Register.css'; // Ensure you have a CSS file for styling

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', { username, email, password });
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
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
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
          <button type="submit" className='register-button'>Register</button>
        </form>
        <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
      </div>
    </div>
  );
}

export default Register;