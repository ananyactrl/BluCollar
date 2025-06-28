import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '200px' };
const GOOGLE_MAPS_API_KEY = 'AIzaSyDcEBM1lUnoyZBk0dH9M877_YyofV1rarI';
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi as fallback

const JobLocationMap = ({ lat, lng, name }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  // Validate coordinates
  const validLat = typeof lat === 'number' ? lat : parseFloat(lat);
  const validLng = typeof lng === 'number' ? lng : parseFloat(lng);
  const hasValidCoords =
    isLoaded &&
    validLat &&
    validLng &&
    !isNaN(validLat) &&
    !isNaN(validLng) &&
    Math.abs(validLat) <= 90 &&
    Math.abs(validLng) <= 180;

  if (!isLoaded) return <div style={containerStyle} className="map-loading">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={hasValidCoords ? { lat: validLat, lng: validLng } : DEFAULT_CENTER}
      zoom={hasValidCoords ? 15 : 5}
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
      {hasValidCoords && (
        <Marker
          position={{ lat: validLat, lng: validLng }}
          title={name ? `${name}'s location` : 'Job location'}
        />
      )}
    </GoogleMap>
  );
};

export default JobLocationMap; 