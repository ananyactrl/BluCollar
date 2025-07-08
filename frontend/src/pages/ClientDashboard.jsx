import React, { useState, useEffect } from 'react';
import './ClientDashboard.css'; // We will create this file next
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSocket } from '../services/socketService';
import { useAuth } from '../context/AuthContext';

// Placeholder data - in a real app, this would come from an API
const upcomingBookingsData = [
    {
        id: 1,
        service: 'Deep House Cleaning',
        worker: 'Ramesh Kumar',
        date: 'July 28, 2024',
        time: '10:00 AM',
        status: 'Confirmed',
    },
    {
        id: 2,
        service: 'Plumbing Repair',
        worker: 'Sita Sharma',
        date: 'August 02, 2024',
        time: '2:00 PM',
        status: 'Confirmed',
    },
];

const pastBookingsData = [
    {
        id: 3,
        service: 'Electrical Wiring',
        worker: 'Amit Singh',
        date: 'June 15, 2024',
        status: 'Completed',
        rating: 4,
    },
    {
        id: 4,
        service: 'House Painting',
        worker: 'Priya Mehta',
        date: 'May 20, 2024',
        status: 'Completed',
        rating: null,
    },
];

// --- Star Rating Component ---
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>&#9733;</span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};

const API = import.meta.env.VITE_BACKEND_URL + '/api';

export default function ClientDashboard() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (!token) {
                    setError('You must be logged in to see your bookings.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API}/ai/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const bookings = response.data;
                const now = new Date();

                const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
                const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

                setUpcomingBookings(upcoming);
                setPastBookings(past);
            } catch (err) {
                if (err.response && err.response.status === 403 && err.response.data.message?.includes('jwt expired')) {
                    logout();
                } else {
                    setError('Failed to load bookings. Please try again later.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate, token, logout]);

    useEffect(() => {
        const socket = getSocket();
        if (user?.id) {
            socket.emit('join-room', `client_${user.id}`);
        }
        socket.on('job-accepted', (data) => {
            toast.info(data.message || 'A worker has accepted your job!');
        });
        socket.on('job-cancelled', (data) => {
            toast.warning(data.message || 'A worker has cancelled your job!');
        });
        // Listen for job status update and redirect if ongoing
        socket.on('job-status-update', (data) => {
            if (data.status === 'ongoing' && data.jobId) {
                navigate(`/job-in-progress/${data.jobId}`);
            }
        });
        return () => {
            socket.off('job-accepted');
            socket.off('job-cancelled');
            socket.off('job-status-update');
        };
    }, [user, navigate]);

    if (loading) {
        return <div className="loading-screen">Loading your bookings...</div>;
    }

    if (error) {
        return <div className="error-screen">{error}</div>;
    }

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.post(`${API}/ai/job-request/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update the local state to reflect the cancellation
            setUpcomingBookings(prevBookings => 
                prevBookings.filter(booking => booking.id !== bookingId)
            );
            setPastBookings(prevBookings => [
                ...prevBookings,
                ...upcomingBookings.filter(booking => booking.id === bookingId)
                    .map(booking => ({ ...booking, status: 'cancelled' }))
            ]);
            
            toast.success('Booking cancelled successfully');
        } catch (err) {
            toast.error('Failed to cancel booking. Please try again.');
            console.error(err);
        }
    };

    const handlePayment = async (booking) => {
        try {
            // Here you would integrate with your payment gateway
            // For example, redirect to a payment page or open a payment modal
            window.open(`/payment?bookingId=${booking.id}&amount=${booking.amount}`, '_blank');
        } catch (err) {
            toast.error('Payment initiation failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="client-dashboard-container">
            <ToastContainer />
            <div className="dashboard-account-bar">
                {user ? (
                    <>
                        <span className="dashboard-username">{user.name}</span>
                        <button className="dashboard-account-btn" onClick={() => navigate('/account-settings')}>Account Details</button>
                        <button className="dashboard-logout-btn" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <button className="dashboard-login-btn" onClick={() => navigate('/login')}>Login</button>
                )}
            </div>
            {user && (
                <div className="dashboard-welcome" style={{ padding: '1.5rem 1.5rem 0 1.5rem', fontSize: '1.4rem', fontWeight: 600, color: '#123459' }}>
                    Welcome back, {user.name.split(' ')[0]}!
                </div>
            )}
            <header className="dashboard-header">
                <h1>My Bookings</h1>
                <p>Manage your upcoming and past service bookings.</p>
            </header>

            <main className="dashboard-content">
                <section className="bookings-section">
                    <h2>Upcoming Bookings</h2>
                    <div className="bookings-list">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map(booking => (
                                <div key={booking.id} className="booking-card">
                                    <div className="booking-details">
                                        <h3>{booking.service}</h3>
                                        <p><strong>Worker:</strong> {booking.workerName || 'Pending Assignment'}</p>
                                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                                        <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                                        <p><strong>Amount:</strong> ₹{booking.amount || 'To be determined'}</p>
                                    </div>
                                    <div className="booking-actions">
                                        {booking.status === 'pending' && (
                                            <button 
                                                className="btn-danger"
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && !booking.isPaid && (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handlePayment(booking)}
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You have no upcoming bookings.</p>
                        )}
                    </div>
                </section>

                <section className="bookings-section">
                    <h2>Past Bookings</h2>
                    <div className="bookings-list">
                        {pastBookings.length > 0 ? (
                            pastBookings.map(booking => (
                                <div key={booking.id} className="booking-card">
                                    <div className="booking-details">
                                        <h3>{booking.service}</h3>
                                        <p><strong>Worker:</strong> {booking.workerName || 'N/A'}</p>
                                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                        <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                                        <div className="booking-rating">
                                            {booking.rating ? <StarRating rating={booking.rating} /> : 'Not rated yet'}
                                        </div>
                                    </div>
                                    <div className="booking-actions">
                                        {booking.rating === null && <button className="btn-primary">Rate Worker</button>}
                                        <button className="btn-primary">Add Tip</button>
                                        <button className="btn-secondary">Add to Favorites</button>
                                        <button className="btn-secondary">Book Again</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You have no past bookings.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}