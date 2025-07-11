import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AuthRedirectModal from './components/AuthRedirectModal';
import { FaCheckCircle, FaClock, FaCalendarAlt, FaBroom } from "react-icons/fa";
import MobileFooter from './components/MobileFooter';
import Header from './components/Header';

import './JobRequestForm.css';

const API = import.meta.env.VITE_BACKEND_URL + '/api';
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 18.5204, // Pune default
  lng: 73.8567
};

export default function JobRequestForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const serviceType = queryParams.get('service');

  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone_number: '',
    date: '',
    address: '',
    timeSlot: '',
    serviceType: serviceType || 'maid',
    service_frequency: 'one-time',
    special_instructions: '',
    room_count: '',
    estimated_area: '',
    preferred_gender: 'no-preference',
    emergency_contact: '',
    problem_description: '',
    service_duration: '',
    total_amount: 0, // Default total_amount
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng
  });

  const [marker, setMarker] = useState(defaultCenter);

  const onMapClick = useCallback((event) => {
    // Leaflet event: event.latlng
    setMarker({
      lat: event.latlng.lat,
      lng: event.latlng.lng
    });
    setFormData(prev => ({
      ...prev,
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    }));
  }, []);

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData(prev => ({ ...prev, address }));
    if (address && OPENCAGE_API_KEY) {
      try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: address,
            key: OPENCAGE_API_KEY,
            limit: 1,
            no_annotations: 1,
          },
        });
        const result = response.data.results[0];
        if (result) {
          setMarker({ lat: result.geometry.lat, lng: result.geometry.lng });
          setFormData(prev => ({ ...prev, latitude: result.geometry.lat, longitude: result.geometry.lng }));
        }
      } catch (err) {
        // Optionally show error
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const jobData = {
        ...formData,
        client_id: user ? user.id : null,
      };
      const response = await fetch(`${API}/ai/job-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData),
      });

      if (response.status === 401) {
        alert('Please log in to submit a job request.');
        // Optionally, redirect to login page
        // navigate('/login');
        return;
      }

      if (response.status === 409) {
        const data = await response.json();
        alert(data.message); // Or show a nicer UI message
        return;
      }

      if (response.ok) {
        alert('Job request submitted!');
        navigate('/');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ lat: latitude, lng: longitude });
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchActiveRequest = async () => {
      setLoadingActive(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${API}/ai/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Find the first active request (pending or ongoing)
        const active = res.data.find(j => j.status === 'pending' || j.status === 'ongoing');
        setActiveRequest(active || null);
      } catch (err) {
        setActiveRequest(null);
      } finally {
        setLoadingActive(false);
      }
    };
    fetchActiveRequest();
  }, []);

  const handleCancel = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/job-request/${jobId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job request cancelled.');
      setActiveRequest(null);
    } catch (err) {
      toast.error('Failed to cancel job request.');
    }
  };

  if (showAuthModal) {
    return <AuthRedirectModal onClose={() => setShowAuthModal(false)} />;
  }

  if (!isAuthenticated) return null;

  if (loadingActive) return <div>Loading...</div>;

  if (activeRequest) {
    return (
      <div className="page-wrapper">
        <div className="request-form-wrapper">
          <div className="request-form-container">
            <div className="active-job-card">
              <div className="active-job-header">
                <FaCheckCircle className="active-job-icon" />
                <h2>Your Active Job Request</h2>
                <p>
                  <span className="active-job-highlight">Great!</span> You already have an active job request.
                  <br />
                  You can cancel it below or view all your bookings.
                </p>
              </div>
              <div className="active-job-details">
                <div className="active-job-row">
                  <FaBroom className="active-job-detail-icon" />
                  <span>Service:</span>
                  <span className="active-job-value">{activeRequest?.serviceType || activeRequest?.service_type || "—"}</span>
                </div>
                <div className="active-job-row">
                  <FaCalendarAlt className="active-job-detail-icon" />
                  <span>Date:</span>
                  <span className="active-job-value">{activeRequest?.date || activeRequest?.service_date || "—"}</span>
                </div>
                <div className="active-job-row">
                  <FaClock className="active-job-detail-icon" />
                  <span>Time:</span>
                  <span className="active-job-value">{activeRequest?.timeSlot || activeRequest?.time_slot || activeRequest?.time || "—"}</span>
                </div>
                <div className="active-job-row">
                  <span>Status:</span>
                  <span className={`active-job-status ${activeRequest?.status}`}>{activeRequest?.status || "—"}</span>
                </div>
              </div>
              <div className="active-job-actions">
                <button className="active-job-cancel-btn" onClick={() => handleCancel(activeRequest.id)}>Cancel Request</button>
                <button className="active-job-bookings-btn" onClick={() => navigate('/my-bookings')}>Go to My Bookings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="page-wrapper" style={{ paddingBottom: '80px' }}>
        <div className="request-form-wrapper">
          <div className="request-form-container">
            <div className="request-form-header">
              <h1>Request a Service</h1>
              <p>Tell us what you need and when you need it. We'll connect you with trusted local professionals.</p>
            </div>

            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={user ? user.name : formData.name}
                      readOnly={!!user}
                      className={user ? "readonly-input" : ""}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number*</label>
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="Enter your phone number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={user ? user.email : formData.email}
                      readOnly={!!user}
                      className={user ? "readonly-input" : ""}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergency_contact"
                      placeholder="Emergency contact number"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section service-details">
                <h3>Service Details</h3>
                <div className="form-row">
                  <div className="form-group card-field">
                    <label>Service Type*</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                    >
                      <option value="maid">Maid Service</option>
                      <option value="deep-cleaning">Deep Cleaning</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="kitchen">Kitchen Cleaning</option>
                    </select>
                  </div>
                  <div className="form-group card-field">
                    <label>Service Frequency</label>
                    <select
                      name="service_frequency"
                      value={formData.service_frequency}
                      onChange={handleChange}
                    >
                      <option value="one-time">One-time Service</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group card-field">
                    <label>Service Duration</label>
                    <select
                      name="service_duration"
                      value={formData.service_duration}
                      onChange={handleChange}
                    >
                      <option value="2-hours">2 Hours</option>
                      <option value="4-hours">4 Hours</option>
                      <option value="6-hours">6 Hours</option>
                      <option value="8-hours">8 Hours</option>
                      <option value="full-day">Full Day</option>
                    </select>
                  </div>
                  <div className="form-group card-field">
                    <label>Preferred Gender</label>
                    <select
                      name="preferred_gender"
                      value={formData.preferred_gender}
                      onChange={handleChange}
                    >
                      <option value="no-preference">No Preference</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Location & Scheduling</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Address*</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleAddressChange}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Rooms</label>
                    <input
                      type="number"
                      name="room_count"
                      placeholder="Number of rooms"
                      value={formData.room_count}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimated Area (sq ft)</label>
                    <input
                      type="text"
                      name="estimated_area"
                      placeholder="Approximate area in sq ft"
                      value={formData.estimated_area}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group card-field">
                    <label>Preferred Date*</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group card-field select-time">
                    <label>Preferred Time*</label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="08:00 - 10:00 AM">08:00 - 10:00 AM</option>
                      <option value="10:00 - 12:00 PM">10:00 - 12:00 PM</option>
                      <option value="12:00 - 02:00 PM">12:00 - 02:00 PM</option>
                      <option value="02:00 - 04:00 PM">02:00 - 04:00 PM</option>
                      <option value="04:00 - 06:00 PM">04:00 - 06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section additional-details">
                <h3>Additional Details</h3>
                <div className="form-row">
                  <div className="form-group card-field">
                    <label>Special Instructions</label>
                    <textarea
                      name="special_instructions"
                      placeholder="Any special instructions or requirements"
                      value={formData.special_instructions}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  <div className="form-group card-field">
                    <label htmlFor="problem_description">Problem Description</label>
                    <textarea
                      name="problem_description"
                      placeholder="Describe the job in detail..."
                      value={formData.problem_description}
                      onChange={handleChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <label>Pick your location on the map</label>
                <MapContainer
                  center={marker && !isNaN(marker.lat) && !isNaN(marker.lng) && Math.abs(marker.lat) <= 90 && Math.abs(marker.lng) <= 180 ? marker : { lat: 28.6139, lng: 77.2090 }}
                  zoom={marker && !isNaN(marker.lat) && !isNaN(marker.lng) && Math.abs(marker.lat) <= 90 && Math.abs(marker.lng) <= 180 ? 15 : 5}
                  style={containerStyle}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onMapClick={onMapClick} />
                  {marker && !isNaN(marker.lat) && !isNaN(marker.lng) && Math.abs(marker.lat) <= 90 && Math.abs(marker.lng) <= 180 && (
                    <Marker position={marker}>
                      <Popup>Selected Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
                <div>
                  <small>Selected Lat: {formData.latitude}, Lng: {formData.longitude}</small>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Book a Service
              </button>
            </form>
          </div>
        </div>
      </div>
      <MobileFooter />
    </>
  );
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick
  });
  return null;
}