import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../locales/workerLogin';
import './WorkerSignup.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import WorkerHeader from '../../components/WorkerHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../components/LanguageContext';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-e4mr.onrender.com';

function WorkerLogin() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Move AOS.init() here
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/api/worker/login`, credentials);
      // Save email/phone for suggestions
      let suggestions = JSON.parse(localStorage.getItem('workerEmailSuggestions') || '[]');
      if (!suggestions.includes(credentials.emailOrPhone)) {
        suggestions.push(credentials.emailOrPhone);
        localStorage.setItem('workerEmailSuggestions', JSON.stringify(suggestions));
      }
      localStorage.setItem('workerToken', response.data.token);
      localStorage.setItem('workerUser', JSON.stringify(response.data.worker));
      alert('Login successful!');
      navigate('/worker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <WorkerHeader />
      <div className="worker-login-container" style={{ paddingTop: '60px' }}>
        <div className="worker-signup-wrapper">
          <div className="worker-signup-container">
            <div className="signup-form-section" data-aos="fade-up">
              <div className="signup-header">
                <h1>{t?.login_title || "Login"}</h1>
                <p>{t?.login_description || "Please login below"}</p>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group full-width">
                  <label className="required">{t.email_or_phone_label}</label>
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={credentials.emailOrPhone}
                    onChange={handleChange}
                    placeholder={t.email_or_phone_placeholder}
                    required
                    autoComplete="username"
                    list="worker-email-suggestions"
                  />
                </div>
                <datalist id="worker-email-suggestions">
                  {JSON.parse(localStorage.getItem('workerEmailSuggestions') || '[]').map((suggestion, idx) => (
                    <option value={suggestion} key={idx} />
                  ))}
                </datalist>
                <div className="form-group full-width" style={{ position: 'relative' }}>
                  <label className="required">{t.password_label}</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder={t.password_placeholder}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="button-group">
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? t.logging_in_button : t.login_button}
                  </button>
                </div>
                <p className="redirect-text">
                  {t.no_account_text} <a href="/worker/signup">{t.signup_here_link}</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WorkerLogin;
