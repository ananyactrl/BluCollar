import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socketService';
import JobLocationMap from '../JobLocationMap';
import MobileFooter from '../components/MobileFooter';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_BACKEND_URL + '/api';

const JobInProgress = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [worker, setWorker] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/ai/job-request/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch job');
        const data = await res.json();
        setJob(data);
        setStatus(data.status);
        if (data.assignedWorkerId) {
          const workerRes = await fetch(`${API}/worker/worker/${data.assignedWorkerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (workerRes.ok) {
            setWorker(await workerRes.json());
          }
        }
      } catch (err) {
        setError('Could not load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, token]);

  useEffect(() => {
    const socket = getSocket();
    if (!jobId) return;
    socket.emit('join-job-room', jobId);
    socket.on('job-status-update', (data) => {
      if (data.jobId === jobId) {
        setStatus(data.status);
        if (data.status === 'completed') {
          // Optionally redirect to review/payment page
        }
        if (data.status === 'cancelled') {
          navigate('/my-bookings');
        }
      }
    });
    return () => {
      socket.off('job-status-update');
    };
  }, [jobId, navigate]);

  const handleCancel = async () => {
    try {
      await fetch(`${API}/ai/job-request/${jobId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/my-bookings');
    } catch (err) {
      alert('Failed to cancel job.');
    }
  };

  const handlePay = () => {
    // Redirect to payment page or open payment modal
    window.open(`/payment?jobId=${jobId}&amount=${job?.total_amount || 0}`, '_blank');
  };

  if (loading) return <div className="job-progress-loading">Loading job...</div>;
  if (error) return <div className="job-progress-error">{error}</div>;
  if (!job) return <div className="job-progress-error">Job not found.</div>;

  return (
    <div className="job-in-progress-page" style={{ paddingBottom: '80px' }}>
      <div className="job-progress-card">
        <h2>Work In Progress</h2>
        <div className="job-progress-status">Status: <b>{status}</b></div>
        <div className="job-progress-details">
          <p><b>Service:</b> {job.serviceType}</p>
          <p><b>Address:</b> {job.address}</p>
          <p><b>Date:</b> {job.date}</p>
          <p><b>Time:</b> {job.timeSlot}</p>
          <p><b>Price:</b> ₹{job.total_amount || '—'}</p>
        </div>
        {worker && (
          <div className="job-progress-worker">
            <h4>Your Worker</h4>
            <p><b>Name:</b> {worker.name}</p>
            <p><b>Phone:</b> {worker.phone || 'N/A'}</p>
            {/* Add more worker details as needed */}
          </div>
        )}
        <div className="job-progress-map">
          <JobLocationMap lat={job.latitude} lng={job.longitude} name={job.serviceType} />
        </div>
        <div className="job-progress-actions">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="pay-btn" onClick={handlePay}>Pay</button>
        </div>
      </div>
      <MobileFooter />
    </div>
  );
};

export default JobInProgress; 