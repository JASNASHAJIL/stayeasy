import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StayContext } from "../../context/StayContext.jsx";
import { useChat } from "../../context/ChatContext.jsx";
import API from "../../api";

export default function OwnerDashboard() {
  const { stays, loading, error, fetchStays, user } = useContext(StayContext);
  const { totalUnread } = useChat();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredStays = stays.filter((stay) =>
    stay.title.toLowerCase().includes(search.toLowerCase()) ||
    stay.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stay?")) return;
    
    try {
      await API.delete(`/owner/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("Stay deleted successfully");
      fetchStays(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete stay");
    }
  };

  const handleEdit = async (stay) => {
    const newRent = window.prompt("Enter new rent:", stay.rent);
    if (newRent === null) return; // Cancelled

    const newStatus = window.prompt("Enter new status (Available/Rented):", stay.status);
    if (newStatus === null) return; // Cancelled

    try {
      await API.put(`/owner/update/${stay._id}`, 
        { rent: newRent, status: newStatus }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Stay updated successfully");
      fetchStays(); // Refresh UI
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stay");
    }
  };

  return (
    <div style={styles.page}>
      {/* Profile Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px", 
        background: "#fff", 
        padding: "20px", 
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <img 
              src={user?.profilePic ? `http://localhost:5000${user.profilePic}` : "https://placehold.co/100x100?text=Profile"} 
              alt="Profile" 
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }}
              onError={(e) => e.target.src = "https://placehold.co/100x100?text=Profile"}
            />
            <label 
              htmlFor="profile-upload" 
              style={{ position: "absolute", bottom: "0", right: "0", background: "#2563eb", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
              title="Upload Profile Picture"
            >
              📷
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: "none" }} 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const formData = new FormData();
                formData.append("profilePic", file);

                try {
                  const res = await API.put("/owner/profile", formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                  });
                  const updatedUser = { ...user, profilePic: res.data.owner.profilePic };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                  window.location.reload(); 
                } catch (err) {
                  alert("Failed to upload profile picture");
                }
              }}
            />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b" }}>{user?.name}</h2>
            <p style={{ margin: 0, color: "#64748b" }}>Owner Dashboard</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            onClick={() => navigate("/chat")}
            style={{ position: "relative", padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            💬 Messages
            {totalUnread > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 'bold',
                border: '2px solid white'
              }}>{totalUnread > 9 ? '9+' : totalUnread}</span>
            )}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "#333" }}>My Added Stays</h2>

      {loading && <p style={styles.infoText}>Loading stays...</p>}
      {error && <p style={{ ...styles.infoText, color: "#ff4d4f" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 15px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={styles.cardContainer}>
        {filteredStays.length === 0 && !loading && (
          <p style={styles.infoText}>{stays.length === 0 ? "No stays added yet." : "No stays match your search."}</p>
        )}

        {filteredStays.map((stay) => (
          <div key={stay._id} style={styles.card}>
            {stay.images?.[0] && (
              <img
                src={(() => {
                  const img = stay.images[0];
                  if (img.startsWith("http")) return img;
                  if (img.startsWith("photo-")) return `https://images.unsplash.com/${img}?w=500&h=300&fit=crop`;
                  return `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`;
                })()}
                alt={stay.title}
                style={styles.cardImage}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/400x300?text=No+Image";
                }}
              />
            )}

            <h3 style={styles.cardTitle}>{stay.title}</h3>
            <p style={styles.cardText}>{stay.address}</p>
            <p style={styles.cardText}>Rent: ₹{stay.rent}</p>
            <p style={styles.cardText}>Type: {stay.type}</p>
            <p style={styles.cardText}>
              Status:{" "}
              <span style={stay.status === "Available" ? styles.available : styles.unavailable}>
                {stay.status}
              </span>
            </p>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(stay);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(stay._id);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStays.length > 0 && (
        <div style={styles.mapWrapper}>
          <MapContainer center={[20, 78]} zoom={5} style={styles.mapContainer}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredStays.map((stay) => (
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

/* =================== STYLES =================== */
const styles = {
  page: {
    padding: "40px 20px",
    background: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  infoText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#888",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    width: "240px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  cardImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  cardText: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "4px",
  },
  available: {
    color: "#28a745",
    fontWeight: "600",
  },
  unavailable: {
    color: "#ff4d4f",
    fontWeight: "600",
  },
  mapWrapper: {
    height: "450px",
    marginTop: "40px",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
  mapContainer: {
    height: "100%",
    width: "100%",
  },
};
