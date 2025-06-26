import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null); // Using state instead of localStorage
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
              <Link to="/account-settings" className="header-avatar-link" title="My Account">
                <div className="header-avatar">
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    : (user.name ? user.name[0].toUpperCase() : <FaUser />)
                  }
                </div>
              </Link>
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
              <Link to="/account-settings" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};
export default Header;