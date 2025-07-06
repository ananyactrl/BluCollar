import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './FindWorkers.css';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import WorkerHeader from '../components/WorkerHeader';
import Footer from '../components/Footer';
import { getReviewSummary } from '../services/reviewService';
import { getToken } from '../context/AuthContext';

// Better API URL handling with fallback
const getApiUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.warn('VITE_BACKEND_URL not set, using localhost fallback');
    return 'http://localhost:3001/api';
  }
  return backendUrl + '/api';
};

const API = getApiUrl();

// Helper to parse query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FindWorkers = () => {
  const query = useQuery();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workerRatings, setWorkerRatings] = useState({});

  // Search and filter states
  const [service, setService] = useState(query.get('service') || '');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [sort, setSort] = useState('rating_desc');
  const [showFilters, setShowFilters] = useState(false);


  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching workers from:', `${API}/worker/search`);
      
      const params = new URLSearchParams();
      if (service) params.append('service', service);
      if (location) params.append('location', location);
      if (gender) params.append('gender', gender);
      if (sort) params.append('sort', sort);

      const response = await axios.get(`${API}/worker/search?${params.toString()}`);
      console.log('Workers response:', response.data);
      setWorkers(response.data);
    } catch (err) {
      console.error('Error fetching workers:', err);
      if (err.response?.status === 404) {
        setError('Backend service not found. Please check if the server is running.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to fetch workers. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []); // Fetch on initial render

  useEffect(() => {
    if (workers.length === 0) return;
    const token = getToken();
    const fetchRatings = async () => {
      const ratingsObj = {};
      await Promise.all(workers.map(async (worker) => {
        try {
          const summary = await getReviewSummary(worker.id, token);
          ratingsObj[worker.id] = summary;
        } catch {
          ratingsObj[worker.id] = { averageRating: null, reviewCount: 0 };
        }
      }));
      setWorkerRatings(ratingsObj);
    };
    fetchRatings();
  }, [workers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers();
  };
  
  const handleResetFilters = () => {
    setService('');
    setLocation('');
    setGender('');
    setSort('rating_desc');
    // Re-fetch with default filters
    fetchWorkers();
  };

  // Book Now handler: send notification to worker
  const handleBookNow = async (worker) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`${API}/worker/notify`, { workerId: worker.id, clientName: user?.name });
      toast.success(`Notification sent to ${worker.name}!`);
    } catch (err) {
      toast.error('Failed to notify worker.');
    }
  };

  return (
    <>
      <Header />
      <div className="find-workers-container" style={{ paddingTop: '100px' }}>
        <div className="container">
          <header className="search-header">
            <h1>Find the Right Professional</h1>
            <p>Search for skilled workers by service, location, and more.</p>
          </header>

          <div className="search-container">
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Service (e.g., Maid, Plumber)"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location (e.g., Pune)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
              <button type="button" className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter /> Filters
              </button>
            </form>

            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Sort By</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="rating_desc">Highly Rated</option>
                    <option value="rating_asc">Rating (Lowest First)</option>
                  </select>
                </div>
                <div className="filter-actions">
                   <button onClick={handleSearch} className="apply-filters-btn">Apply Filters</button>
                   <button onClick={handleResetFilters} className="reset-filters-btn">Reset</button>
                </div>
              </div>
            )}
          </div>

          <main className="results-container">
            {loading && <div className="loader">Loading workers...</div>}
            {error && (
              <div className="error-message">
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={fetchWorkers} className="retry-btn">Retry</button>
              </div>
            )}
            {!loading && !error && (
              <div className="workers-grid">
                {workers.length > 0 ? (
                  workers.map(worker => (
                    <div key={worker.id} className="worker-card">
                      <div className="worker-card-header">
                        {worker.profile_photo ? (
                          <img 
                            src={worker.profile_photo.startsWith('http') ? worker.profile_photo : `${API.replace('/api', '')}/${worker.profile_photo.replace(/\\/g, '/')}`}
                            alt={worker.name}
                            className="worker-avatar"
                          />
                        ) : (
                          <div className="worker-avatar worker-avatar-initial" style={{width: 48, height: 48, borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#123459'}}>
                            {worker.name ? worker.name[0].toUpperCase() : '?'}
                          </div>
                        )}
                        <div className="worker-title">
                          <h3>{worker.name}</h3>
                          <span className="worker-profession">{worker.profession}</span>
                        </div>
                      </div>
                      <div className="worker-card-body">
                        <p className="worker-description">{worker.description?.substring(0, 100)}...</p>
                        <div className="worker-meta">
                          <span className="worker-rating">
                            <FaStar />{' '}
                            {workerRatings[worker.id]?.averageRating
                              ? `${workerRatings[worker.id].averageRating} (${workerRatings[worker.id].reviewCount} reviews)`
                              : 'N/A'}
                          </span>
                          <span className="worker-location"><FaMapMarkerAlt /> {worker.address}</span>
                          <span className="worker-experience"><FaBriefcase /> {worker.experience}</span>
                        </div>
                      </div>
                      <div className="worker-card-footer">
                        <button className="book-now-btn" onClick={() => handleBookNow(worker)}>Book Now</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <h3>No workers found</h3>
                    <p>Try adjusting your search filters.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FindWorkers; 