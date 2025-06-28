import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../locales/workerDashboard'; // Will create this later
import './WorkerSignup.css'; // Reusing general styles
import './WorkerMobile.css';
import 'aos/dist/aos.css';
import WorkerHeader from '../../components/WorkerHeader';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-e4mr.onrender.com';

function WorkerDashboard() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const t = translations[language];
  const [workerName, setWorkerName] = useState('Worker');
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkerData = async () => {
      const token = localStorage.getItem('workerToken');
      if (!token) {
        navigate('/worker/login');
        return;
      }

      try {
        // Fetch worker profile (for name)
        const workerProfileResponse = await axios.get(`${API}/api/worker/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkerName(workerProfileResponse.data.name || 'Worker');

        // Fetch job statistics
        const jobStatsResponse = await axios.get(`${API}/api/worker/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobStats(jobStatsResponse.data);

      } catch (err) {
        console.error('Error fetching worker data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        // If token is invalid or expired, force logout
        if (err.response?.status === 401) {
          localStorage.removeItem('workerToken');
          navigate('/worker/login');
        }
      }
    };

    fetchWorkerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    navigate('/worker/login');
  };

  return (
    <>
      <WorkerHeader />
      <div className="worker-dashboard-wrapper" style={{ paddingTop: '60px' }}>
        <div className="worker-dashboard-container">
          <div className="language-toggle">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
            </select>
          </div>

          <div className="dashboard-header" data-aos="fade-down">
            <h1>{t.welcome_greeting.replace('{workerName}', workerName)}</h1>
            <p>{t.dashboard_description}</p>
            <button onClick={handleLogout} className="logout-btn">{t.logout_button}</button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="stats-grid" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-card">
              <h3>{t.total_jobs}</h3>
              <p>{jobStats.totalJobs}</p>
            </div>
            <div className="stat-card">
              <h3>{t.pending_jobs}</h3>
              <p>{jobStats.pendingJobs}</p>
            </div>
            <div className="stat-card">
              <h3>{t.total_earnings}</h3>
              <p>${jobStats.totalEarnings ? jobStats.totalEarnings.toFixed(2) : '0.00'}</p>
            </div>
          </div>

          <div className="dashboard-section" data-aos="fade-up" data-aos-delay="200">
            <h2>{t.recent_jobs_title}</h2>
            <p>{t.no_recent_jobs}</p>
          </div>

          <div className="dashboard-section" data-aos="fade-up" data-aos-delay="225">
            <h2>{t.my_jobs_title}</h2>
            <p>{t.my_jobs_description}</p>
            <button className="submit-btn" onClick={() => navigate('/worker/jobs')}>{t.view_my_jobs_button}</button>
          </div>

          <div className="dashboard-section" data-aos="fade-up" data-aos-delay="250">
            <h2>{t.profile_summary_title}</h2>
            <p>{t.profile_summary_description}</p>
            <button className="submit-btn" onClick={() => navigate('/worker/account')}>{t.view_profile_button}</button>
          </div>

        </div>
        <footer className="worker-footer">
          <div className="footer-content">
            <div className="footer-credit">
              <span className="footer-credit-line">
                developed by <span className="footer-credit-name">ananya singh</span>
              </span>
              <div className="footer-credit-icons">
                <a href="https://github.com/ananyactrl/BluCollar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/ananya-singh-028571371/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              © 2025 BluCollar. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default WorkerDashboard; 