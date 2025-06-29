import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  // Detect both customer and worker
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
    const workerStored = localStorage.getItem('workerUser');
    if (workerStored) return JSON.parse(workerStored);
    return null;
  });
  const isWorker = !!localStorage.getItem('workerToken');
  const isCustomer = !!localStorage.getItem('token');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('workerUser');
    localStorage.removeItem('workerToken');
    setUser(null);
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
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
          <a href="/" className="logo">
            <div className="logo-dots">
              <span className="logo-dot"></span>
              <span className="logo-dot"></span>
              <span className="logo-dot"></span>
            </div>
            <span className="brand-name">BluCollar</span>
          </a>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/find-workers" className="nav-link">Find a Worker</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          <div className="nav-buttons">
            {/* Add login/signup or other buttons here if needed */}
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />
      </header>

      {/* Mobile Header (visible on mobile only) */}
      <header className="mobile-header">
        <a href="/" className="logo">
          <div className="logo-dots">
            <span className="logo-dot"></span>
            <span className="logo-dot"></span>
            <span className="logo-dot"></span>
          </div>
          <span className="logo-text">BluCollar</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(isCustomer || isWorker) && (
            <div className="header-avatar-link" style={{ position: 'relative', marginRight: 4 }}>
              <div className="header-avatar" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, width: 28, height: 28, borderRadius: '50%', background: '#e7f5ff', color: '#1a2a4c', fontSize: '1rem', fontWeight: 700, overflow: 'hidden' }}>
                {user?.profilePhoto
                  ? <img src={user.profilePhoto} alt="Account" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                  : (user?.name ? user.name[0].toUpperCase() : <FaUser />)
                }
                <FaChevronDown style={{ fontSize: 12, marginLeft: 2 }} />
              </div>
              {dropdownOpen && (
                <div className="header-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 160, zIndex: 100 }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{user?.name}</div>
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
                        style={{ display: 'block', padding: '8px 14px', color: '#123459', textDecoration: 'none' }}
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
                        style={{ display: 'block', padding: '8px 14px', color: '#123459', textDecoration: 'none' }}
                      >
                        Account Settings
                      </Link>
                    </>
                  )}
                  {isWorker && (
                    <>
                      <Link to="/worker/dashboard" className="dropdown-link" onClick={() => { setDropdownOpen(false); setIsMobileMenuOpen(false); }} style={{ display: 'block', padding: '8px 14px', color: '#123459', textDecoration: 'none' }}>Worker Dashboard</Link>
                      <Link to="/worker/account" className="dropdown-link" onClick={() => { setDropdownOpen(false); setIsMobileMenuOpen(false); }} style={{ display: 'block', padding: '8px 14px', color: '#123459', textDecoration: 'none' }}>Account</Link>
                    </>
                  )}
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'none', border: 'none', color: '#dc2626', textAlign: 'left', cursor: 'pointer' }}>Log Out</button>
                </div>
              )}
            </div>
          )}
          <button className="hamburger" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/services" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/find-workers" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Find a Worker</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </header>
    </>
  );
};
export default Header;