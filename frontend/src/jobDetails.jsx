import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './jobDetails.css';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getToken } from './context/AuthContext';
import { getReviewSummary, getReviews } from './services/reviewService';

const containerStyle = { width: '100%', height: '350px' };
const GOOGLE_MAPS_API_KEY = 'AIzaSyDcEBM1lUnoyZBk0dH9M877_YyofV1rarI';

function WorkerJobMap({ destinationAddress }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    if (isLoaded && destinationAddress && window.google) {
      // Geocode the destination address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destinationAddress }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          const destination = results[0].geometry.location;
          setDestinationCoords({ lat: destination.lat(), lng: destination.lng() });
        }
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(origin);
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin,
              destination: destinationAddress,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);
              }
            }
          );
        });
      }
    }
  }, [isLoaded, destinationAddress]);

  const hasValidCoords = destinationCoords && !isNaN(destinationCoords.lat) && !isNaN(destinationCoords.lng) && Math.abs(destinationCoords.lat) <= 90 && Math.abs(destinationCoords.lng) <= 180;
  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="job-details-map-section">
      <h3 className="map-section-title">Route to Customer</h3>
      <div className="job-details-map-container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={hasValidCoords ? destinationCoords : DEFAULT_CENTER}
            zoom={hasValidCoords ? 13 : 5}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
            {hasValidCoords && (
              <Marker 
                position={destinationCoords}
                title="Customer Location"
              />
            )}
          </GoogleMap>
        ) : (
          <div style={containerStyle} className="map-loading">Loading map...</div>
        )}
      </div>
    </div>
  );
}

export default function JobDetailsWrapper() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API}/api/job-request/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);

  // Check if already reviewed
  useEffect(() => {
    const checkReviewed = async () => {
      if (!job || !job.worker_id || !job.customer_id) return;
      setReviewLoading(true);
      setReviewError(null);
      try {
        const token = getToken();
        const reviews = await getReviews(job.worker_id, token);
        const already = reviews.some(r => r.job_id === job.id && r.reviewer_id === job.customer_id);
        setReviewed(already);
      } catch (err) {
        setReviewError('Could not check review status.');
      } finally {
        setReviewLoading(false);
      }
    };
    checkReviewed();
  }, [job]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError(null);
    try {
      const token = getToken();
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewee_id: job.worker_id,
          job_id: job.id,
          rating,
          comment
        })
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setReviewed(true);
      setShowReviewModal(false);
    } catch (err) {
      setReviewError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return <div className="job-details-loading">Loading...</div>;

  // Only show button if job is completed, user is customer, and not already reviewed
  const user = JSON.parse(localStorage.getItem('user'));
  const canReview = job.status === 'completed' && user && user.id === job.customer_id && !reviewed;

  return (
    <div className="job-details-main">
      <div className="job-details-card">
        <h2 className="job-details-title">Job Request</h2>
        <div className="job-details-info">
          <p><span className="job-details-label">Customer Name:</span> {job.name}</p>
          <p><span className="job-details-label">Address:</span> {job.address}</p>
          <p><span className="job-details-label">Service Type:</span> {job.serviceType}</p>
          <p><span className="job-details-label">Date:</span> {job.date}</p>
          <p><span className="job-details-label">Time Slot:</span> {job.timeSlot}</p>
          {/* Add more fields as needed */}
        </div>
        <button
          className="navigate-btn"
          onClick={() => openGoogleMaps(job.address)}
        >
          Open in Google Maps
        </button>
        {canReview && (
          <button className="review-btn" onClick={() => setShowReviewModal(true)} style={{ marginTop: 16 }}>
            Write a Review
          </button>
        )}
        {reviewed && <div style={{ color: 'green', marginTop: 8 }}>Thank you for your review!</div>}
        {reviewError && <div style={{ color: 'red', marginTop: 8 }}>{reviewError}</div>}
      </div>
      <WorkerJobMap destinationAddress={job.address} />
      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(18,52,89,0.15)' }}>
            <h3 style={{ color: '#123459', marginBottom: 12 }}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <label style={{ fontWeight: 600 }}>Rating:</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginBottom: 12, width: '100%', padding: 8, borderRadius: 6 }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <label style={{ fontWeight: 600 }}>Comment:</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} style={{ width: '100%', marginBottom: 12, borderRadius: 6, padding: 8 }} maxLength={1000} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setShowReviewModal(false)} style={{ background: '#eee', color: '#123459', border: 'none', borderRadius: 6, padding: '8px 16px' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#123459', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px' }}>{submitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function openGoogleMaps(address) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  window.open(url, '_blank');
}
