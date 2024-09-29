import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      history.push('/questions');
    } catch (err) {
      console.log("err",err)
    }
  };

  const handleRegister = () => {
    history.push('/register');
  };

  return (
    <div className="login-container">
      <h1 className="heading">CodeZoro</h1>
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <a href="/register" className="register-link">Register</a>
      </div>
    </div>
  );
}

export default Login;