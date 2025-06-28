import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './FindWorkers.css';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaFilter } from 'react-icons/fa';

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
  const [modalWorker, setModalWorker] = useState(null);

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

  return (
    <div className="find-workers-page">
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
                      <button className="view-profile-btn" onClick={() => setModalWorker(worker)}>View Profile</button>
                      <Link to={`/job-request?service=${worker.profession === 'cook' ? 'cooking' : worker.profession}&workerId=${worker.id}`} className="book-now-btn">Book Now</Link>
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
      {/* Worker Profile Modal */}
      {modalWorker && (
        <div className="worker-profile-modal-overlay" onClick={() => setModalWorker(null)}>
          <div className="worker-profile-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setModalWorker(null)}>&times;</button>
            <div className="modal-header">
              {modalWorker.profile_photo ? (
                <img 
                  src={modalWorker.profile_photo.startsWith('http') ? modalWorker.profile_photo : `${API.replace('/api', '')}/${modalWorker.profile_photo.replace(/\\/g, '/')}`}
                  alt={modalWorker.name}
                  className="worker-avatar"
                  style={{width: 64, height: 64, borderRadius: '50%'}}
                />
              ) : (
                <div className="worker-avatar worker-avatar-initial" style={{width: 64, height: 64, borderRadius: '50%', background: '#e6f0fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#123459'}}>
                  {modalWorker.name ? modalWorker.name[0].toUpperCase() : '?'}
                </div>
              )}
              <div className="modal-title-info">
                <h2>{modalWorker.name}</h2>
                <div className="modal-profession">{modalWorker.profession}</div>
                <div className="modal-rating"><FaStar /> {modalWorker.rating || 'N/A'}</div>
                <div className="modal-address"><FaMapMarkerAlt /> {modalWorker.address}</div>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-description">{modalWorker.description}</div>
              {/* Portfolio images if available */}
              {modalWorker.portfolio_files && Array.isArray(modalWorker.portfolio_files) && modalWorker.portfolio_files.length > 0 && (
                <div className="modal-portfolio">
                  <h4>Portfolio</h4>
                  <div className="portfolio-images">
                    {modalWorker.portfolio_files.map((file, idx) => (
                      <img key={idx} src={file.startsWith('http') ? file : `${API.replace('/api', '')}/${file.replace(/\\/g, '/')}`} alt={`Portfolio ${idx+1}`} className="portfolio-image" style={{maxWidth: 100, maxHeight: 100, borderRadius: 8, margin: 4}} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindWorkers; 