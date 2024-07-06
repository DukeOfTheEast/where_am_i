"use client";

import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

// Dynamically import the Map component from react-map-gl
const Map = dynamic(() => import("react-map-gl"), { ssr: false });
const Marker = dynamic(() => import("react-map-gl").then((mod) => mod.Marker), {
  ssr: false,
});
const NavigationControl = dynamic(
  () => import("react-map-gl").then((mod) => mod.NavigationControl),
  { ssr: false }
);

export default function Home() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapboxToken =
    "pk.eyJ1IjoiZnJlZXplMTk5OSIsImEiOiJjbHlha2NkdDAwOGQ3MmpxdHdtaHM2ZHc1In0.JpjAaN76PxjFuJz97U5PUQ"; // Replace with your Mapbox token

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude); // Debugging log
          setLocation({ latitude, longitude });
          setLoading(false);

          try {
            // Fetch the address from Nominatim API
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            console.log("API Response:", response.data); // Debugging log
            const result = response.data;
            setAddress(result.display_name);
          } catch (err) {
            console.error("API Request Failed:", err); // Debugging log
            setError("Failed to fetch address.");
          }
        },
        (err) => {
          console.error("Geolocation Error:", err); // Debugging log
          setLoading(false);
          setError("Failed to get location.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>My Location App</h1>
      <button
        onClick={getLocation}
        style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
      >
        Get My Location
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : location.latitude && location.longitude ? (
        <div style={{ marginTop: "20px" }}>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          {address ? <p>Address: {address}</p> : <p>Fetching address...</p>}
          <div style={{ height: "400px", marginTop: "20px" }}>
            <Map
              initialViewState={{
                longitude: location.longitude,
                latitude: location.latitude,
                zoom: 15,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={mapboxToken}
            >
              <Marker
                latitude={location.latitude}
                longitude={location.longitude}
              ></Marker>
              {/* <div
                className="marker"
                latitude={location.latitude}
                longitude={location.longitude}
              >
                <svg
                  height="20"
                  viewBox="0 0 24 24"
                  style={{ fill: "red", transform: "translate(-50%, -50%)" }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
                </svg>
              </div> */}
              <div style={{ position: "absolute", right: 10, top: 10 }}>
                <NavigationControl />
              </div>
            </Map>
          </div>
        </div>
      ) : (
        <p>{error || "Click the button to get your location."}</p>
      )}
    </div>
  );
}
