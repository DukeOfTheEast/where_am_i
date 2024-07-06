"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState({
    road: null,
    house_number: null,
    city: null,
    country: null,
  });
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
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const addressDetails = response.data.address;
            setAddress({
              road: addressDetails.road || "N/A",
              house_number: addressDetails.house_number || "N/A",
              city:
                addressDetails.city ||
                addressDetails.town ||
                addressDetails.village ||
                "N/A",
              country: addressDetails.country || "N/A",
            });
          } catch (err) {
            setError("Failed to fetch address.");
          }
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true } // Request high accuracy
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
          {address.road ||
          address.house_number ||
          address.city ||
          address.country ? (
            <div>
              <p>Street: {address.road}</p>
              <p>House Number: {address.house_number}</p>
              <p>City: {address.city}</p>
              <p>Country: {address.country}</p>
            </div>
          ) : (
            <p>Fetching address...</p>
          )}
        </div>
      ) : (
        <p>{error || "Click the button to get your location."}</p>
      )}
    </div>
  );
}
