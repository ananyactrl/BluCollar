import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ApplicationSummary.css';
import './WorkerMobile.css';
import { FaUserCheck } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const ApplicationSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workerData } = location.state || {}; // Get worker data from route state

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!workerData) {
    // Redirect if no data is passed
    return navigate('/worker/signup');
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    Object.keys(workerData).forEach(key => {
        if (key === 'portfolioFiles') {
            workerData[key].forEach(file => formData.append('portfolioFiles', file));
        } else if (key === 'skills' || key === 'certifications') {
            const val = workerData[key];
            if (typeof val === 'string' && val.trim() === '') return; // skip empty strings
            formData.append(key, val);
        } else if(workerData[key] !== null && workerData[key] !== undefined) {
            formData.append(key, workerData[key]);
        }
    });

    try {
      await axios.post(`${API_URL}/api/worker/signup`, formData, {
        
      });
      navigate('/worker/login', { state: { successMessage: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="summary-page">
      <div className="summary-card">
        <div className="summary-header">
            <div className="summary-icon-wrapper">
                <FaUserCheck size={24} />
            </div>
            <h2>Application Summary</h2>
            <p>Please review your details before submitting. You can go back to make changes.</p>
        </div>
        
        {error && <div className="summary-error">{error}</div>}

        <div className="summary-details">
            {/* You can optionally display a summary of the details here */}
            <p><strong>Profession:</strong> {workerData.profession}</p>
            <p><strong>Name:</strong> {workerData.name}</p>
            <p><strong>Email:</strong> {workerData.email}</p>
        </div>
        
        <div className="summary-actions">
            <button 
                className="submit-app-btn" 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button className="back-btn" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummary; 