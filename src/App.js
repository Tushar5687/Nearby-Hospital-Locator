import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner'; // Correct path if the file is in src/components

 // Import the spinner

// Utility function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// MapRedrawHandler: Ensures the map is properly redrawn after state changes
const MapRedrawHandler = () => {
  const map = useMap();
  map.invalidateSize();
  return null;
};

const App = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [userAddress, setUserAddress] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isSearchingByAddress, setIsSearchingByAddress] = useState(false);
  const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);

  const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY; // Geoapify API Key
  const opencageApiKey = process.env.REACT_APP_OPENCAGE_API_KEY; // OpenCage API Key

  // Fetch hospitals using Geoapify API
  const fetchHospitals = async (lat, lon) => {
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},5000&limit=10&apiKey=${apiKey}`;

    setLoading(true);
    try {
      const response = await axios.get(url);
      const hospitalsData = await Promise.all(
        response.data.features.map(async (hospital) => {
          const { lat, lon, name, id } = hospital.properties;
          const distance = calculateDistance(lat, lon, location.lat, location.lon);
          const hospitalAddress = await fetchHospitalAddress(lat, lon);
          return {
            ...hospital,
            properties: {
              ...hospital.properties,
              distance: distance.toFixed(2),
              address: hospitalAddress,
            },
          };
        })
      );
      hospitalsData.sort((a, b) => a.properties.distance - b.properties.distance);
      setHospitals(hospitalsData);
    } catch (err) {
      setError('Error fetching hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch address for a hospital
  const fetchHospitalAddress = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
      const response = await axios.get(url);
      return response.data?.display_name || 'Address not available';
    } catch {
      return 'Error fetching address';
    }
  };

  // Fetch location using OpenCage API for address-based search
  const fetchLocationFromAddress = async (address) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${opencageApiKey}`;

    setLoading(true);
    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result && result.geometry) {
        const { lat, lng } = result.geometry;
        setLocation({ lat, lon: lng });
        setMapCenter([lat, lng]);
        fetchHospitals(lat, lng);
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error fetching location');
    } finally {
      setLoading(false);
    }
  };

  // Fetch location using geolocation API
  const fetchLocationFromCurrent = () => {
    if (navigator.geolocation) {
      setIsFetchingCurrentLocation(true);
      setIsSearchingByAddress(false); // Stop address-based search when current location is fetched
      console.log('Fetching current location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location fetched:', latitude, longitude, accuracy);
          setLocation({ lat: latitude, lon: longitude });
          setMapCenter([latitude, longitude]);
          fetchHospitals(latitude, longitude); // Fetch hospitals after setting location
          setLocationError('');
        },
        (error) => {
          setLocationError('Unable to fetch your location. Please allow location access.');
          console.error('Error fetching location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const redMarkerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const handleBookAppointment = (hospital) => {
    alert(`Booking appointment at: ${hospital.name}`);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submit action
    if (userAddress) {
      fetchLocationFromAddress(userAddress);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Nearby Hospitals</h1>
        </div>
        <div className="navbar-right">
          <form onSubmit={handleAddressSubmit} className="address-form">
            <input
              type="text"
              id="address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter address"
              className="address-input"
            />
            <button type="submit" className="find-btn">
              Search by address
            </button>
            <button
              type="button"
              className="get-location-btn"
              onClick={fetchLocationFromCurrent}
            >
              Search By Location
            </button>
          </form>
        </div>
      </nav>

      {locationError && <div className="error-message">{locationError}</div>}

      {loading && <LoadingSpinner />} {/* Show loading spinner */}

      {location.lat && location.lon && (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '600px', width: '100%' }}
          className="map-container"
        >
          <MapRedrawHandler />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lon]} icon={redMarkerIcon}>
            <Popup>My Location</Popup>
          </Marker>

          {hospitals.map((hospital, index) => {
            const { lat, lon, name, distance, address } = hospital.properties;
            return (
              <Marker key={index} position={[lat, lon]} icon={redMarkerIcon}>
                <Popup>
                  <h4>{name}</h4>
                  <p>{distance} km away from you</p>
                  <p>{address}</p>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}

      {hospitals.length > 0 && (
        <div className="hospital-list">
          <h3>Hospitals Near You:</h3>
          <div className="hospital-cards">
            {hospitals.map((hospital, index) => (
              <div key={index} className="hospital-card">
                <h4>{hospital.properties.name}</h4>
                <p>{hospital.properties.distance} km away from you</p>
                <p>{hospital.properties.address}</p>
                <button
                  className="book-appointment-btn"
                  onClick={() => handleBookAppointment(hospital.properties)}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;