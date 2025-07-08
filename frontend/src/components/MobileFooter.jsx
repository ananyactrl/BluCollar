import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSpa, FaHome, FaLock, FaUser, FaUsers, FaClipboardList, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MobileFooter = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/account-settings');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <footer className="mobile-footer">
        <Link to="/" className="mobile-footer-item active">
          <span className="blu-logo">Blu</span>
        </Link>
        <Link to="/services" className="mobile-footer-item">
          <FaSpa size={22} />
          <span className="footer-item-label">Services</span>
        </Link>
        <Link to="/" className="mobile-footer-item">
          <FaHome size={22} />
          <span className="footer-item-label">Homes</span>
        </Link>
        <Link to="/find-workers" className="mobile-footer-item">
          <FaUsers size={22} />
          <span className="footer-item-label">Workers</span>
        </Link>
        <a href="#account" className="mobile-footer-item" onClick={handleAccountClick}>
          <FaUser size={22} />
          <span className="footer-item-label">Account</span>
        </a>
      </footer>
      {showAuthModal && (
        <div style={{position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: 'white', padding: 24, borderRadius: 12, textAlign: 'center', minWidth: 220}}>
            <h3>Sign up or Log in</h3>
            <p>You need to be logged in to access your account settings.</p>
            <div style={{marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center'}}>
              <button onClick={() => { setShowAuthModal(false); navigate('/login'); }} style={{padding: '8px 18px', borderRadius: 8, background: '#123459', color: 'white', border: 'none'}}>Login</button>
              <button onClick={() => { setShowAuthModal(false); navigate('/signup'); }} style={{padding: '8px 18px', borderRadius: 8, background: '#f3f4f6', color: '#123459', border: 'none'}}>Sign Up</button>
            </div>
            <button onClick={() => setShowAuthModal(false)} style={{marginTop: 12, background: 'none', color: '#888', border: 'none', textDecoration: 'underline', cursor: 'pointer'}}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export const WorkerMobileFooter = () => {
  const location = useLocation();
  return (
    <footer className="mobile-footer">
      <Link to="/worker/dashboard" className={location.pathname.startsWith('/worker/dashboard') ? 'active' : ''}>
        <span className="footer-icon"><FaBriefcase /></span>
        <span className="footer-label">Jobs</span>
      </Link>
      <Link to="/worker/services" className={location.pathname.startsWith('/worker/services') ? 'active' : ''}>
        <span className="footer-icon"><FaSpa /></span>
        <span className="footer-label">Services</span>
      </Link>
      <Link to="/worker/job-requests" className={location.pathname.startsWith('/worker/job-requests') ? 'active' : ''}>
        <span className="footer-icon"><FaClipboardList /></span>
        <span className="footer-label">Requests</span>
      </Link>
      <Link to="/worker/account" className={location.pathname.startsWith('/worker/account') ? 'active' : ''}>
        <span className="footer-icon"><FaUser /></span>
        <span className="footer-label">Account</span>
      </Link>
    </footer>
  );
};

export default MobileFooter;