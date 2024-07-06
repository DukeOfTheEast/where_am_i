"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);

          try {
            // Fetch the address from Nominatim API
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            setAddress(response.data.display_name);
          } catch (err) {
            setError("Failed to fetch address.");
          }
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>My Location App</h1>
      <button
        onClick={getLocation}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Get My Location
      </button>
      {location.latitude && location.longitude ? (
        <div style={{ marginTop: "20px" }}>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          {address ? <p>Address: {address}</p> : <p>Fetching address...</p>}
        </div>
      ) : (
        <p>{error || "Click the button to get your location."}</p>
      )}
    </div>
  );
}
