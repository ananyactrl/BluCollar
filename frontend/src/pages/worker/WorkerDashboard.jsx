import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../components/LanguageContext';
import { translations } from '../../locales/workerDashboard';
import WorkerHeader from '../../components/WorkerHeader';
import Footer from '../../components/Footer';
import './WorkerLanding.css';
import { getSocket } from '../../services/socketService';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-e4mr.onrender.com';

function WorkerDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [workerName, setWorkerName] = useState('Worker');
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0
  });
  const [error, setError] = useState('');
  const [bookingBanner, setBookingBanner] = useState(null);
  const [unseenBookings, setUnseenBookings] = useState([]);

  useEffect(() => {
    const fetchWorkerData = async () => {
      const token = localStorage.getItem('workerToken');
      if (!token) {
        navigate('/worker/login');
        return;
      }
      try {
        const workerProfileResponse = await axios.get(`${API}/api/worker/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkerName(workerProfileResponse.data.name || 'Worker');
        const jobStatsResponse = await axios.get(`${API}/api/worker/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobStats(jobStatsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        if (err.response?.status === 401) {
          localStorage.removeItem('workerToken');
          navigate('/worker/login');
        }
      }
    };
    fetchWorkerData();

    // Listen for stats update event
    const handleStatsUpdate = () => fetchWorkerData();
    window.addEventListener('worker-dashboard-stats-update', handleStatsUpdate);
    return () => {
      window.removeEventListener('worker-dashboard-stats-update', handleStatsUpdate);
    };
  }, [navigate]);

  // Persistent notification logic
  useEffect(() => {
    // Load unseen bookings from localStorage
    const stored = localStorage.getItem('unseenBookings');
    if (stored) {
      setUnseenBookings(JSON.parse(stored));
      setBookingBanner(JSON.parse(stored)[0]?.message || null);
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const workerUser = JSON.parse(localStorage.getItem('workerUser'));
    if (workerUser?.id) {
      socket.emit('join-worker-room', workerUser.id);
    }
    // Listen for booking-request
    socket.on('booking-request', (data) => {
      setBookingBanner(`${data.customerName} has requested your service!`);
      toast.info(`New booking request from ${data.customerName}!`, {
        position: 'top-right',
        autoClose: 5000
      });
      // Save to localStorage for persistence
      const prev = JSON.parse(localStorage.getItem('unseenBookings') || '[]');
      const updated = [...prev, data];
      localStorage.setItem('unseenBookings', JSON.stringify(updated));
      setUnseenBookings(updated);
    });
    return () => {
      socket.off('booking-request');
    };
  }, []);

  // Mark notification as seen
  const handleCloseBanner = () => {
    setBookingBanner(null);
    // Remove the first unseen booking
    const updated = unseenBookings.slice(1);
    setUnseenBookings(updated);
    localStorage.setItem('unseenBookings', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    navigate('/worker/login');
  };

  return (
    <div className="worker-landing">
      {bookingBanner && (
        <div className="booking-banner">
          <span>{bookingBanner}</span>
          <button onClick={handleCloseBanner}>&times;</button>
        </div>
      )}
      <WorkerHeader />
      <main style={{ minHeight: '80vh', background: '#fafdff' }}>
        <section className="worker-hero" style={{ background: 'linear-gradient(120deg, #fafdff 0%, #eaf6fb 100%)', color: '#123459', minHeight: 'unset', padding: '4rem 0 2rem' }}>
          <div className="hero-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="hero-text">
              <div className="title-container">
                <h1 style={{ color: '#123459', textShadow: '0 2px 8px #eaf6fb' }}>Welcome, {workerName}!</h1>
              </div>
              <p className="hero-description" style={{ color: '#567c8d' }}>Here's a summary of your activities and earnings.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button onClick={handleLogout} className="primary-button">{t.logout_button}</button>
              </div>
            </div>
          </div>
        </section>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{error}</p>}

        <section className="worker-benefits" style={{ padding: '2rem 0 0 0', background: 'none' }}>
          <div className="section-title" style={{ color: '#123459', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Stats</div>
          <div className="benefits-grid" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px #eaf6fb', padding: '2rem 1rem', gap: '2rem' }}>
            <div className="benefit-card">
              <h3 className="benefit-title" style={{ color: '#153a67' }}>{t.total_jobs}</h3>
              <p className="benefit-description" style={{ color: '#123459', fontWeight: 700 }}>{jobStats.totalJobs}</p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title" style={{ color: '#153a67' }}>Completed Jobs</h3>
              <p className="benefit-description" style={{ color: '#123459', fontWeight: 700 }}>{jobStats.completedJobs || 0}</p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title" style={{ color: '#153a67' }}>{t.pending_jobs}</h3>
              <p className="benefit-description" style={{ color: '#123459', fontWeight: 700 }}>{jobStats.pendingJobs}</p>
            </div>
            <div className="benefit-card">
              <h3 className="benefit-title" style={{ color: '#153a67' }}>{t.total_earnings}</h3>
              <p className="benefit-description" style={{ color: '#123459', fontWeight: 700 }}>${jobStats.totalEarnings ? jobStats.totalEarnings.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </section>

        <section className="worker-services" style={{ padding: '2rem 0 0 0', background: 'none' }}>
          <div className="section-title" style={{ color: '#123459', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</div>
          <div className="hero-buttons" style={{ justifyContent: 'center', marginBottom: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px #eaf6fb', padding: '2rem 1rem', gap: '2rem' }}>
            <button className="primary-button" onClick={() => navigate('/worker/jobs')}>{t.view_my_jobs_button}</button>
            <button className="outline-button" onClick={() => navigate('/worker/account')}>{t.view_profile_button}</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default WorkerDashboard; 