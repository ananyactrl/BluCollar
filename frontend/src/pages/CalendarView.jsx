import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css'; // For your custom styles
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

Modal.setAppElement('#root'); // For accessibility

const STATUS_COLORS = {
  pending: '#f59e42',
  accepted: '#1A4C81',
  completed: '#2ecc40',
  cancelled: '#dc2626',
};

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const intervalRef = useRef();

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/my-bookings`, { withCredentials: true });
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    intervalRef.current = setInterval(fetchBookings, 10000); // Poll every 10s
    return () => clearInterval(intervalRef.current);
  }, []);

  // Tooltip content for each date
  const getTooltipContent = (date) => {
    const bookingsForDay = bookings.filter(
      b => new Date(b.date).toDateString() === date.toDateString()
    );
    if (bookingsForDay.length === 0) return '';
    return bookingsForDay.map(b => `${b.service} (${b.status}) at ${b.time}`).join('\n');
  };

  // Color-coded dots for each booking status
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const bookingsForDay = bookings.filter(
        b => new Date(b.date).toDateString() === date.toDateString()
      );
      if (bookingsForDay.length === 0) return null;
      return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
          {bookingsForDay.map((b, i) => (
            <span
              key={b.id + i}
              data-tip={getTooltipContent(date)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: STATUS_COLORS[b.status] || '#123459',
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      );
    }
  };

  // On date click, show modal with all bookings for that day
  const handleDateClick = (value) => {
    setDate(value);
    const bookingsForDay = bookings.filter(
      b => new Date(b.date).toDateString() === value.toDateString()
    );
    setSelectedBookings(bookingsForDay);
    setModalOpen(true);
  };

  // Cancel booking (if allowed)
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.post(`${API_URL}/api/bookings/cancel`, { id: bookingId }, { withCredentials: true });
      fetchBookings();
      setSelectedBookings(selectedBookings.filter(b => b.id !== bookingId));
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  return (
    <div className="calendar-view-container">
      <h2>📅 Calendar View of Bookings</h2>
      <button className="refresh-btn" onClick={fetchBookings} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      <button className="nav-btn" onClick={() => window.location.href = '/dashboard'}>
        Back to Dashboard
      </button>
      {error && <div className="calendar-error">{error}</div>}
      {loading ? (
        <div className="calendar-loading">Loading...</div>
      ) : (
        <>
          <Calendar
            onClickDay={handleDateClick}
            value={date}
            tileContent={tileContent}
          />
          <Tooltip effect="solid" multiline={true} />
        </>
      )}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="calendar-modal"
        overlayClassName="calendar-modal-overlay"
      >
        <h3>Bookings for {date.toDateString()}</h3>
        {selectedBookings.length === 0 ? (
          <p>No bookings for this day.</p>
        ) : (
          <ul>
            {selectedBookings.map(b => (
              <li key={b.id} style={{ marginBottom: 16 }}>
                <strong>{b.service}</strong> at {b.time} <br />
                Status: <span style={{ color: STATUS_COLORS[b.status] || '#123459' }}>{b.status}</span> <br />
                {b.workerName && <>Worker: {b.workerName}<br /></>}
                {b.status === 'pending' || b.status === 'accepted' ? (
                  <button className="cancel-btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <button className="close-modal-btn" onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default CalendarView;
