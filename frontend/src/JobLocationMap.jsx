import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const JobLocationMap = ({ lat, lng, height = '320px', name }) => {
  const containerStyle = { width: '100%', height };
  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi as fallback

  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if ((!lat || !lng) && navigator.geolocation) {
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
    }
  }, [lat, lng]);

  const center = (lat && lng)
    ? { lat: Number(lat), lng: Number(lng) }
    : userLocation || DEFAULT_CENTER;

  const markerPosition = (lat && lng)
    ? { lat: Number(lat), lng: Number(lng) }
    : userLocation || DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={(lat && lng) ? 15 : (userLocation ? 15 : 5)}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={markerPosition}>
        <Popup>
          {name ? <b>{name}</b> : null}<br />
          {geoError
            ? geoError
            : (lat && lng
                ? 'Job location'
                : 'Location not found, showing default.')}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default JobLocationMap; 