import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [soilCenters, setSoilCenters] = useState([]);

  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: currentPosition.lat,
    lng: currentPosition.lng
  };

  // Load user's current location and fetch nearby soil centers
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({
          lat: latitude,
          lng: longitude
        });

        // Call Google Places API to find nearby soil testing labs
        fetchSoilCenters(latitude, longitude);
      },
      () => {
        console.error("Geolocation not supported or permission denied.");
      }
    );
  }, []);

  // Function to fetch nearby soil testing labs using Google Places API
  const fetchSoilCenters = async (lat, lng) => {
    const apiKey = 'AIzaSyA6fOVqQQVi-SaOpPWxdL1trMDZMW1nq-Y'; // Replace with your Google API Key
    const radius = 5000; // Search radius in meters (adjust as needed)
    const keyword = 'soil testing lab'; // Can adjust keyword to be more specific

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${apiKey}`);
      const places = response.data.results;

      // Format the data into a format suitable for the map
      const centers = places.map((place, index) => ({
        id: index,
        name: place.name,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      }));
      
      setSoilCenters(centers);
    } catch (error) {
      console.error("Error fetching nearby soil centers:", error);
    }
  };

  return (
    <div className='mt-20'>
      <LoadScript googleMapsApiKey="AIzaSyA6fOVqQQVi-SaOpPWxdL1trMDZMW1nq-Y">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
          {soilCenters.map(center => (
            <Marker
              key={center.id}
              position={center.location}
              title={center.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
