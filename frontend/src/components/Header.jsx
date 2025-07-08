import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/triallogo.png';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  // Detect both customer and worker
  const isWorker = user && user.role === 'worker';
  const isCustomer = user && user.role !== 'worker';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.header-avatar-link')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // --- Desktop Header ---
  return (
    <>
      {/* Desktop Header (visible on desktop only) */}
      <header className="header desktop-header">
        <div className="navbar-container">
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <img src={logoImg} alt="BluCollar Logo" style={{ height: 28, marginRight: 0, verticalAlign: 'middle', display: 'inline-block', position: 'relative', top: '-2px' }} />
            <span className="brand-name" style={{ display: 'inline-block', verticalAlign: 'middle' }}>BluCollar</span>
          </a>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/find-workers" className="nav-link">Find a Worker</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          <div className="nav-buttons">
            {!user && (
              <>
                <Link to="/login" className="header-btn header-btn-outline">Login</Link>
                <Link to="/signup" className="header-btn header-btn-solid">Get started</Link>
              </>
            )}
            {user && (
              <div className="header-avatar-link" style={{ position: 'relative', marginLeft: 12 }}>
                <div className="header-avatar" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: 36, height: 36, borderRadius: '50%', background: '#e7f5ff', color: '#1a2a4c', fontSize: '1.1rem', fontWeight: 700, overflow: 'hidden' }}>
                  {user?.profilePhoto
                    ? <img src={user.profilePhoto} alt="Account" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                    : (user?.name ? user.name[0].toUpperCase() : <FaUser />)
                  }
                  <FaChevronDown style={{ fontSize: 14, marginLeft: 2 }} />
                </div>
                {dropdownOpen && (
                  <div className="header-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{user?.name}</div>
                    {isCustomer && (
                      <>
                        <Link
                          to="/my-bookings"
                          className="dropdown-link"
                          onClick={e => {
                            setDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                            setTimeout(() => navigate('/my-bookings'), 100);
                          }}
                          style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/account-settings"
                          className="dropdown-link"
                          onClick={e => {
                            setDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                            setTimeout(() => navigate('/account-settings'), 100);
                          }}
                          style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}
                        >
                          Account Settings
                        </Link>
                      </>
                    )}
                    {isWorker && (
                      <>
                        <Link to="/worker/dashboard" className="dropdown-link" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>Worker Dashboard</Link>
                        <Link to="/worker/account" className="dropdown-link" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>Account</Link>
                      </>
                    )}
                    <button onClick={logout} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#dc2626', textAlign: 'left', cursor: 'pointer' }}>Log Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;