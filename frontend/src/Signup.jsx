import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './signup.css';

// --- SVG Icons ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);
const AddressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);
const PasswordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const EyeIcon = ({ open }) => (
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.5em', height: '1.5em', cursor: 'pointer'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.5em', height: '1.5em', cursor: 'pointer'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c2.042 0 3.93-.393 5.57-1.077M21.75 12c-.511-1.045-1.24-2.291-2.22-3.477M9.53 9.53a3.75 3.75 0 014.94 4.94M6.75 6.75l10.5 10.5" />
    </svg>
  )
);
// --- End SVG Icons ---

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const returnUrl = location.state?.returnUrl || '/job-request';
  const API = import.meta.env.VITE_BACKEND_URL + '/api/auth';
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.password !== values.confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/signup`, {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        address: values.address,
        password: values.password
      });

      if (response.status === 200) {
        toast.success("✅ Account created successfully! Please log in.");
        navigate('/login', { state: { returnUrl } });
      } else {
        toast.error("❌ Signup failed: " + (response.data?.message || "An unknown error occurred."));
      }
    } catch (error) {
      toast.error("❌ Signup failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-container">
        <div className="info-panel">
          <div className="info-content">
            <h2 className="info-title">Create your BluCollar account</h2>
            <p className="info-text">Join our community of trusted service providers and clients. Get started in just a few minutes.</p>
          </div>
        </div>

        <div className="form-panel">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input 
                  id="firstName" 
                  type="text" 
                  name="firstName" 
                  value={values.firstName} 
                  onChange={handleChange} 
                  placeholder="First name*"
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  id="lastName" 
                  type="text" 
                  name="lastName" 
                  value={values.lastName} 
                  onChange={handleChange} 
                  placeholder="Last name*"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <input 
                id="email" 
                type="email" 
                name="email" 
                value={values.email} 
                onChange={handleChange} 
                placeholder="Email address*"
                required 
              />
            </div>

            <div className="form-group">
              <input 
                id="phone" 
                type="tel" 
                name="phone" 
                value={values.phone} 
                onChange={handleChange} 
                placeholder="Phone number*"
                required 
              />
            </div>

            <div className="form-group">
              <input 
                id="address" 
                type="text" 
                name="address" 
                value={values.address} 
                onChange={handleChange} 
                placeholder="Address*"
                required 
              />
            </div>

            <div className="form-group">
              <input 
                id="password" 
                type="password"
                name="password" 
                value={values.password} 
                onChange={handleChange} 
                placeholder="Password*"
                required 
              />
            </div>

            <div className="form-group">
              <input 
                id="confirmPassword" 
                type="password"
                name="confirmPassword" 
                value={values.confirmPassword} 
                onChange={handleChange} 
                placeholder="Confirm Password*"
                required 
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Create Account'}
            </button>

            <div className="login-link-container">
              <span>Already have an account? </span>
              <Link to="/login" className="login-link">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}