import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { API_ENDPOINTS } from '../apiConfig';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
 try {
      const response = await axios.post(`${API_ENDPOINTS.LOGIN}`, {
        username: username,
        password: password,
      });

      if (response.data && response.data.success) {
        sessionStorage.setItem('isLoggedIn', 'true');
        if (response.data.user) {
          sessionStorage.setItem('user', response.data.user);
        } 

        navigate('/dashboard', { replace: true });
      } else {
        setError(response.data.message || 'Invalid username or password.');
      }
    } catch (err) {
      // Handled network errors or other issues with the API call
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('No response from server. Please check your network.');
      } else {
        setError('Login failed. An unexpected error occurred.');
      }
      console.error('Login API error:', err);
    } finally {
      setIsLoading(false);
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
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter username"
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
              disabled={isLoading}
              placeholder="Enter password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-info">
            <p>Hint: Use the following credentials for demo:</p>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;