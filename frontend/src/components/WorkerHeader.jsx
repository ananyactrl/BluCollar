import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const WorkerHeader = () => {
  const [language, setLanguage] = useState('english');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Worker login state
  const workerUser = JSON.parse(localStorage.getItem('workerUser'));
  const workerToken = localStorage.getItem('workerToken');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Toggle body scroll lock
    if (!isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('workerUser');
    localStorage.removeItem('workerToken');
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
    navigate('/worker/login');
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Close dropdown on outside click (for desktop avatar)
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.worker-avatar-link')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Clean up body class on unmount
  React.useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header className="worker-header desktop-header">
        <div className="navbar-container">
          <Link to="/" className="logo">BluCollar</Link>
          <nav className="nav-links">
            <Link to="/worker" className="nav-link">Home</Link>
            <Link to="/worker/jobs" className="nav-link">See Job Requests</Link>
          </nav>
          <div className="nav-buttons">
            {!workerToken && (
              <>
                <Link to="/worker/login" className="header-btn header-btn-outline">Login</Link>
                <Link to="/worker/signup" className="header-btn header-btn-solid">Join Us</Link>
              </>
            )}
            {workerToken && (
              <div className="worker-avatar-link">
                <div 
                  className="worker-avatar" 
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#e6f0fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {workerUser?.profilePhoto
                      ? <img src={workerUser.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (workerUser?.name ? workerUser.name[0].toUpperCase() : <FaUser />)
                    }
                  </div>
                  <FaChevronDown style={{ fontSize: '12px', transition: 'transform 0.2s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
                {dropdownOpen && (
                  <div className="worker-dropdown">
                    <div style={{ 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #e2e8f0', 
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      {workerUser?.name}
                    </div>
                    <Link 
                      to="/worker/account" 
                      className="dropdown-link" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      Account
                    </Link>
                    <Link 
                      to="/worker/dashboard" 
                      className="dropdown-link" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-link"
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        background: 'none', 
                        border: 'none', 
                        color: '#dc2626', 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        padding: '10px 16px'
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="language-selector">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="marathi">मराठी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="worker-header mobile-header">
        <div className="mobile-header-bar">
          <Link to="/" className="logo">BluCollar</Link>
          <button 
            className="hamburger" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay and Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={handleMobileMenuClose}></div>
          <div className="mobile-menu">
            {/* Close button at top of menu */}
            <button 
              className="mobile-menu-close"
              onClick={handleMobileMenuClose}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>

            {/* User info section for logged in workers */}
            {workerToken && workerUser && (
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid #f0f4f8',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#e6f0fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {workerUser?.profilePhoto
                    ? <img src={workerUser.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (workerUser?.name ? workerUser.name[0].toUpperCase() : <FaUser />)
                  }
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#123459' }}>{workerUser.name}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Worker Account</div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <Link to="/worker" className="nav-link" onClick={handleMobileMenuClose}>
              Home
            </Link>
            <Link to="/worker/jobs" className="nav-link" onClick={handleMobileMenuClose}>
              See Job Requests
            </Link>
            
            {workerToken && (
              <>
                <Link to="/worker/account" className="nav-link" onClick={handleMobileMenuClose}>
                  Account Settings
                </Link>
                <Link to="/worker/dashboard" className="nav-link" onClick={handleMobileMenuClose}>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="nav-link"
                  style={{
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Log Out
                </button>
              </>
            )}

            {!workerToken && (
              <>
                <Link to="/worker/login" className="header-btn header-btn-outline" onClick={handleMobileMenuClose}>
                  Login
                </Link>
                <Link to="/worker/signup" className="header-btn header-btn-solid" onClick={handleMobileMenuClose}>
                  Join Us
                </Link>
              </>
            )}

            {/* Language Selector at Bottom */}
            <div className="language-selector">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="marathi">मराठी</option>
              </select>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WorkerHeader;