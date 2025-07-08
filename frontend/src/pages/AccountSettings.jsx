import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { NavLink, useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';
import { useAuth } from '../context/AuthContext';
import MobileFooter from '../components/MobileFooter';
import Header from '../components/Header';
import Footer from '../components/Footer';


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
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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
            <div className="account-settings-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
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
                <Footer />
                <MobileFooter />
            </div>
        </>
    );
};

export default AccountSettings;
