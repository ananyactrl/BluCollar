import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useAuth } from './context/AuthContext';
import './UserNotFoundModal.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from './components/Header';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserNotFound, setShowUserNotFound] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login form submitted. Starting handleLogin...');
    setLoading(true);

    try {
      console.log('Attempting to send login request to:', `${API_URL}/login`);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      console.log('Login response received:', response);
      if (response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        // Save email for suggestions
        let suggestions = JSON.parse(localStorage.getItem('emailSuggestions') || '[]');
        if (!suggestions.includes(email)) {
          suggestions.push(email);
          localStorage.setItem('emailSuggestions', JSON.stringify(suggestions));
        }
        toast.success('✅ Login Successful!');
        
        // Redirect to the page the user was trying to access, or default to the dashboard.
        const returnUrl = location.state?.returnUrl || '/my-bookings';
        navigate(returnUrl, { replace: true });
      } else {
        console.log('Login response did not contain a token or user data.');
        toast.error('❌ Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials or server error.';
      if (errorMessage.toLowerCase().includes('not found')) {
        setShowUserNotFound(true);
      } else {
        toast.error(`❌ ${errorMessage}`);
      }
    } finally {
      console.log('Finished handleLogin attempt.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page-wrapper" style={{ paddingTop: '90px' }}>
        <div className="login-card">
          <div className="login-card-header">
            <h1>Welcome Back</h1>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form-container">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="username"
                list="email-suggestions"
              />
            </div>
            <datalist id="email-suggestions">
              {JSON.parse(localStorage.getItem('emailSuggestions') || '[]').map((suggestion, idx) => (
                <option value={suggestion} key={idx} />
              ))}
            </datalist>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ 
                    paddingRight: '3rem',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ 
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    fontSize: '1rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-container">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="signup-redirect">
            <span>Don't have an account? </span>
            <Link to="/signup" className="signup-redirect-link">
              Sign up
            </Link>
          </div>
        </div>

        {showUserNotFound && (
          <div className="user-not-found-modal">
            <div className="modal-content">
              <h2>User Not Found</h2>
              <p>No account found with that email. Please sign up to book a service.</p>
              <div className="modal-buttons">
                <button onClick={() => navigate('/signup', { state: { returnUrl: location.state?.returnUrl || '/job-request' } })}>
                  Go to Signup
                </button>
                <button onClick={() => setShowUserNotFound(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}