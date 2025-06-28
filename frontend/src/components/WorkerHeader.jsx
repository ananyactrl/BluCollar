import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaChevronDown } from 'react-icons/fa';

// MobileHeader component for mobile view
const MobileHeader = ({ language, setLanguage, onHamburgerClick, showProfileDropdown, workerUser, workerToken, profileDropdownRef }) => (
  <header className="worker-header mobile-header">
    <div className="mobile-header-bar" style={{ position: 'relative' }}>
      <Link to="/" className="logo">BluCollar</Link>
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
      <button className="hamburger" onClick={onHamburgerClick} aria-label="Open menu" style={{ position: 'relative', zIndex: 102 }}>
        <FaBars />
      </button>
      {/* Profile dropdown below hamburger */}
      {showProfileDropdown && workerToken && workerUser && (
        <div ref={profileDropdownRef} style={{
          position: 'absolute',
          top: '56px',
          right: '0',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(18,52,89,0.12)',
          minWidth: '200px',
          zIndex: 101,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: 22, fontWeight: 700, color: '#123459', marginBottom: 8 }}>
            {workerUser?.profilePhoto
              ? <img src={workerUser.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (workerUser?.name ? workerUser.name[0].toUpperCase() : <FaUser />)
            }
          </div>
          <div style={{ fontWeight: 700, color: '#123459', fontSize: 16 }}>{workerUser.name}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>Worker Account</div>
        </div>
      )}
    </div>
  </header>
);

const WorkerHeader = () => {
  const [language, setLanguage] = useState('english');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Worker login state
  const workerUser = JSON.parse(localStorage.getItem('workerUser'));
  const workerToken = localStorage.getItem('workerToken');

  // Hamburger click handler (mobile)
  const handleHamburgerClick = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!showProfileDropdown) return;
    const handleClick = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target) &&
        !e.target.closest('.hamburger')
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileDropdown]);

  // Only show MobileHeader on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;

  return (
    <>
      {isMobile && (
        <MobileHeader
          language={language}
          setLanguage={setLanguage}
          onHamburgerClick={handleHamburgerClick}
          showProfileDropdown={showProfileDropdown}
          workerUser={workerUser}
          workerToken={workerToken}
          profileDropdownRef={profileDropdownRef}
        />
      )}
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
                      onClick={() => {
                        localStorage.removeItem('workerUser');
                        localStorage.removeItem('workerToken');
                        setDropdownOpen(false);
                        navigate('/worker/login');
                      }} 
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
    </>
  );
};

export default WorkerHeader;