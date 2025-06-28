import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './FindWorkers.css';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import WorkerHeader from '../components/WorkerHeader';

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
      // You may want to collect job details here, for now just send notification
      await axios.post(`${API}/worker/notify`, { workerId: worker.id });
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
                          <span className="worker-rating"><FaStar /> {worker.rating || 'N/A'}</span>
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
        <footer className="footer">
          <div className="footer-bottom">
            <div className="footer-credit">
              <span>
                Project by <span className="footer-credit-name">Ananya Singh</span>
              </span>
              <div className="footer-credit-icons">
                <a href="https://github.com/ananyactrl/BluCollar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/ananya-singh-028571371/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FindWorkers; 