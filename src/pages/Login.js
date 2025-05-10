// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials for the school coordinator (admin role)
  const MOCK_USERNAME = 'Admin';
  const MOCK_PASSWORD = 'password123';

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      localStorage.setItem('userRole', 'admin');

      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2>School Vaccination Portal</h2>
        <h3>Coordinator Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username/Email:</label>
            <input
              type="text" // Could be "email" type for better semantics
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g., coordinator@school.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="e.g., password123"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-info">
            <p>Hint: Use the following credentials for demo:</p>
            <p>Username: <strong>coordinator@school.com</strong></p>
            <p>Password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;