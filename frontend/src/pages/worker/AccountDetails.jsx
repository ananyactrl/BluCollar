import React, { useEffect, useState } from 'react';
import './AccountDetails.css';
import './WorkerMobile.css';
import WorkerHeader from '../../components/WorkerHeader';
import Footer from '../../components/Footer';
import { getReviews, getReviewSummary } from '../../services/reviewService';
import { getToken } from '../../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const API = import.meta.env.VITE_BACKEND_URL || 'https://blucollar-fku9.onrender.com';

export default function AccountDetails() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('workerUser')) || {
    name: 'Unknown',
    email: 'Unknown',
    phone: 'Unknown',
    role: 'Worker',
    registered: 'Unknown'
  };

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: null, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const [reviewsData, summaryData] = await Promise.all([
          getReviews(user.id, token),
          getReviewSummary(user.id, token)
        ]);
        setReviews(reviewsData);
        setSummary(summaryData);
      } catch (err) {
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchReviews();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    localStorage.removeItem('workerUser');
    window.location.href = '/worker/login';
  };

  return (
    <>
      <WorkerHeader />
      <div className="account-details-container" style={{ paddingTop: '60px' }}>
        <div className="account-details-card">
          <div className="profile-avatar">
            <span>{user.name[0]}</span>
          </div>
          <h2 className="account-details-title">Account Details</h2>
          <div className="account-details-info">
            <p><span className="account-details-label">Name:</span> {user.name}</p>
            <p><span className="account-details-label">Email:</span> {user.email}</p>
            <p><span className="account-details-label">Phone:</span> {user.phone}</p>
            <p><span className="account-details-label">Role:</span> {user.role}</p>
            <p><span className="account-details-label">Registered:</span> {user.registered}</p>
          </div>
          <div className="account-actions">
            <button className="edit-btn">Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
          <div className="account-alt">
            <a href="/worker/signup" className="alt-link">Register as a Different User</a>
          </div>
        </div>
      </div>
      <Footer />
      {/* Reviews Section */}
      <div className="reviews-section" style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(18,52,89,0.07)', padding: 24 }}>
        <h3 style={{ color: '#123459', marginBottom: 8 }}>Reviews</h3>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#123459' }}>
                <FaStar style={{ color: '#fbbf24', marginRight: 4 }} />
                {summary.averageRating ? `${summary.averageRating} / 5` : 'No ratings yet'}
              </span>
              <span style={{ marginLeft: 10, color: '#6b7280' }}>
                ({summary.reviewCount} review{summary.reviewCount === 1 ? '' : 's'})
              </span>
            </div>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {reviews.map((review) => (
                  <li key={review.id} style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FaStar style={{ color: '#fbbf24' }} />
                      <span style={{ fontWeight: 600 }}>{review.rating}</span>
                      <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 8 }}>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.comment && <div style={{ marginTop: 4 }}>{review.comment}</div>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
} 