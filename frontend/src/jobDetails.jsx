import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './jobDetails.css';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';

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
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API}/api/job-request/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);

  if (!job) return <div className="job-details-loading">Loading...</div>;

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
      </div>
      <WorkerJobMap destinationAddress={job.address} />
    </div>
  );
}

function openGoogleMaps(address) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  window.open(url, '_blank');
}
