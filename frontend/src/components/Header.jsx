import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
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

  return (
    <>
      {/* Desktop Header */}
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
            {!user && (
              <>
                <Link to="/login" className="header-btn header-btn-outline">Login</Link>
                <Link to="/signup" className="header-btn header-btn-solid">Get started</Link>
              </>
            )}
            {user && (
              <div className="header-avatar-link" style={{ position: 'relative' }}>
                <div className="header-avatar" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    : (user.name ? user.name[0].toUpperCase() : <FaUser />)
                  }
                  <FaChevronDown style={{ fontSize: 14, marginLeft: 2 }} />
                </div>
                {dropdownOpen && (
                  <div className="header-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{user.name}</div>
                    <Link to="/my-bookings" className="dropdown-link" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>My Bookings</Link>
                    <Link to="/account-settings" className="dropdown-link" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>Account Settings</Link>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#dc2626', textAlign: 'left', cursor: 'pointer' }}>Log Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />
      </header>

      {/* Mobile Header */}
      <header className="mobile-header">
        <a href="/" className="logo">
          <div className="logo-dots">
            <span className="logo-dot"></span>
            <span className="logo-dot"></span>
            <span className="logo-dot"></span>
          </div>
          <span className="logo-text">BluCollar</span>
        </a>
        <button className="hamburger" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/services" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/find-workers" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Find a Worker</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            {!user && (
              <>
                <Link to="/login" className="header-btn header-btn-outline" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="header-btn header-btn-solid" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
              </>
            )}
            {user && (
              <div className="mobile-avatar-link" style={{ position: 'relative', marginTop: 12 }}>
                <div className="header-avatar" onClick={() => setDropdownOpen(v => !v)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} alt="Account" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    : (user.name ? user.name[0].toUpperCase() : <FaUser />)
                  }
                  <FaChevronDown style={{ fontSize: 14, marginLeft: 2 }} />
                </div>
                {dropdownOpen && (
                  <div className="header-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{user.name}</div>
                    <Link to="/my-bookings" className="dropdown-link" onClick={() => { setDropdownOpen(false); setIsMobileMenuOpen(false); }} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>My Bookings</Link>
                    <Link to="/account-settings" className="dropdown-link" onClick={() => { setDropdownOpen(false); setIsMobileMenuOpen(false); }} style={{ display: 'block', padding: '10px 16px', color: '#123459', textDecoration: 'none' }}>Account Settings</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#dc2626', textAlign: 'left', cursor: 'pointer' }}>Log Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
export default Header;