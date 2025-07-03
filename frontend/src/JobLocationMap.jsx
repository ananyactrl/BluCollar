import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const JobLocationMap = ({ height = '320px' }) => {
  const containerStyle = { width: '100%', height };
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDcEBM1lUnoyZBk0dH9M877_YyofV1rarI';
  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi as fallback

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setGeoError(error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGeoError('Geolocation is not supported by this browser.');
    }
  }, []);

  if (!isLoaded) return <div style={containerStyle} className="map-loading">Loading map...</div>;

  const center = userLocation || DEFAULT_CENTER;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={userLocation ? 15 : 5}
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
      {userLocation && (
        <Marker
          position={userLocation}
          title={'Your location'}
        />
      )}
    </GoogleMap>
  );
};

export default JobLocationMap; 