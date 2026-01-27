import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StayContext } from "../../context/StayContext.jsx";

export default function OwnerDashboard() {
  const { stays, loading, error } = useContext(StayContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Added Stays</h1>

      {loading && <p>Loading stays...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        {stays.length === 0 && !loading && <p>No stays added yet.</p>}
        {stays.map((stay) => (
          <div
            key={stay._id}
            style={{
              background: "#6b73ff",
              color: "#fff",
              borderRadius: "10px",
              padding: "15px",
              width: "220px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Show first image if available */}
            {stay.images?.[0] && (
              <img
                src={stay.images[0].startsWith("http") ? stay.images[0] : `http://localhost:5000${stay.images[0]}`}
                alt={stay.title}
                style={{ width: "100%", height: "120px", borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }}
              />
            )}

            <h3>{stay.title}</h3>
            <p>{stay.address}</p>
            <p>Rent: ₹{stay.rent}</p>
            <p>Type: {stay.type}</p>
            <p>Status: {stay.status}</p>
          </div>
        ))}
      </div>

      {stays.length > 0 && (
        <div
          style={{
            height: "400px",
            marginTop: "30px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {stays.map((stay) => (
              <Marker key={stay._id} position={[stay.lat || 20, stay.lng || 78]}>
                <Popup>
                  <strong>{stay.title}</strong>
                  <p>{stay.address}</p>
                  <p>Rent: ₹{stay.rent}</p>
                  <p>Status: {stay.status}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
