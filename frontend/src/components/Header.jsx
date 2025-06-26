import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';

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
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About Us</a>
            <a href="/services" className="nav-link">Services</a>
            <a href="/find-workers" className="nav-link">Find a Worker</a>
            <a href="/contact" className="nav-link">Contact</a>
          </nav>
          <div className="nav-buttons">
            {!user && (
              <>
                <a href="/login" className="header-btn header-btn-outline">Login</a>
                <a href="/signup" className="header-btn header-btn-solid">Get started</a>
              </>
            )}
            {user && (
              <a href="/account-settings" className="header-avatar-link" title="My Account">
                <div className="header-avatar">
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} alt="Account" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    : (user.name ? user.name[0].toUpperCase() : <FaUser />)
                  }
                </div>
              </a>
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
            <a href="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
            <a href="/services" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="/find-workers" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Find a Worker</a>
            <a href="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            {!user && (
              <>
                <a href="/login" className="header-btn header-btn-outline" onClick={() => setIsMobileMenuOpen(false)}>Login</a>
                <a href="/signup" className="header-btn header-btn-solid" onClick={() => setIsMobileMenuOpen(false)}>Get started</a>
              </>
            )}
            {user && (
              <a href="/account-settings" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>My Account</a>
            )}
          </div>
        )}
      </header>
    </>
  );
};
export default Header;