import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { NavLink, useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';
import Header from '../components/Header';

// --- SVG Icons ---
const BookingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25L7.5 16.5V3.75m9 0H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75h-1.5z" />
    </svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    if (!user) {
        return <div className="loading-screen">Loading Account...</div>;
    }

    const initials = getInitials(user.name);
    const address = user?.address || {};

    return (
        <>
            <Header />
            <div className="account-settings-container" style={{ paddingTop: '60px' }}>
                <div className="account-settings-wrapper">
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <div className="team-info">
                                <span className="team-avatar">{initials}</span>
                                <div className="team-details">
                                    <span className="team-name">{user.name}'s Team</span>
                                    <span className="team-email">{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <nav className="sidebar-nav">
                            <p className="menu-title">MENU</p>
                            <NavLink to="/my-bookings" className="nav-item"><BookingsIcon />Upcoming Bookings</NavLink>
                            <NavLink to="/past-bookings" className="nav-item"><BookingsIcon />Past Bookings</NavLink>
                            <NavLink to="/favorites" className="nav-item"><HeartIcon />Favorite Workers</NavLink>
                            <button className="nav-item" style={{ background: 'none', border: 'none', padding: 0, margin: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }} onClick={() => setShowCalendar(true)}>📅 View My Calendar</button>
                            <p className="menu-title">ORGANISATION</p>
                            <NavLink to="/account-settings" className="nav-item active"><UserIcon />Account Settings</NavLink>
                            <NavLink to="/payment-methods" className="nav-item"><PaymentIcon />Payment</NavLink>
                        </nav>
                    </aside>
                    <main className="main-content">
                        <header className="main-header-bar">
                            {/* You can add a search bar or notification icons here */}
                        </header>
                        <div className="content-body">
                            <h1 className="page-title">Account Settings</h1>
                            <div className="settings-container">
                                <nav className="settings-nav">
                                    <a href="#my-profile" className="settings-nav-item active">My Profile</a>
                                    <a href="#security" className="settings-nav-item">Security</a>
                                    <a href="#notifications" className="settings-nav-item">Notifications</a>
                                    <a href="#delete-account" className="settings-nav-item danger">Delete Account</a>
                                </nav>
                                <div className="settings-details">
                                    <div className="profile-card card">
                                        <div className="card-header">
                                            <h2>My Profile</h2>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                        <div className="profile-summary">
                                            <div className="profile-avatar-large">{initials}</div>
                                            <div className="profile-info">
                                                <p className="profile-name">{user.name}</p>
                                                <p className="profile-role">Client</p>
                                                <p className="profile-location">Pune, India</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="personal-info-card card">
                                        <div className="card-header">
                                            <h2>Personal Information</h2>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                        <div className="info-grid">
                                            <div className="info-item"><span>Full Name</span><p>{user.name}</p></div>
                                            <div className="info-item"><span>Email address</span><p>{user.email}</p></div>
                                        </div>
                                    </div>
                                    <div className="address-card card">
                                        <div className="card-header">
                                            <h2>Address</h2>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                        <div className="info-grid">
                                            <div className="info-item"><span>City/State</span><p>{address?.cityState || '-'}</p></div>
                                            <div className="info-item"><span>Postal Code</span><p>{address?.postalCode || '-'}</p></div>
                                            <div className="info-item"><span>TAX ID</span><p>{address?.taxId || '-'}</p></div>
                                        </div>
                                    </div>
                                    {showCalendar && (
                                        <div className="calendar-inline-card">
                                            <button className="close-calendar-btn" onClick={() => setShowCalendar(false)} title="Close">×</button>
                                            <CalendarView />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <footer className="footer">
                  <div className="footer-bottom">
                    <div className="footer-credit">
                      <span>
                        Developed by <span className="footer-credit-name">Ananya Singh</span>
                      </span>
                      <div className="footer-credit-icons">
                        <a href="https://github.com/ananyactrl/BluCollar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/ananya-singh-60a730372/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </footer>
            </div>
        </>
    );
};

export default AccountSettings;
