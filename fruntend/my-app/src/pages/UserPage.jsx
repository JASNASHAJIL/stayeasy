import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API from "../api";
import Footer from "../components/Footer";

export default function UserPage() {
  const [stays, setStays] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const fetchStays = (query = "") => {
    const url = query ? `/stay/search?title=${query}` : "/stay/all";
    API.get(url)
      .then((res) => setStays(res.data.stays || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStays(search);
  };

  // ---------------- Contact Owner with login & subscription check ----------------
  const handleContactOwner = async (stayId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {
      // Not logged in → redirect to login
      navigate("/login");
      return;
    }

    if (!user.isSubscribed) {
      // Logged in but not subscribed → redirect to subscription page
      navigate("/subscribe");
      return;
    }

    try {
      const res = await API.get(`/stay/contact/${stayId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      window.location.href = `tel:${res.data.phone}`;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to contact owner");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header + Search */}
      <div style={styles.headerSearchWrapper}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search</button>
        </form>
      </div>

      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarHeading}>StayEase</h3>
          <ul style={styles.sidebarList}>
            <li style={styles.sidebarItem}>🏠 Home</li>
            <li style={styles.sidebarItem}>➕ Add Stay</li>
            <li style={styles.sidebarItem}>📍 Map View</li>
            <li style={styles.sidebarItem}>📄 My Bookings</li>
          </ul>

          <div style={styles.sidebarStats}>
            <p><strong>Total Stays:</strong> {stays.length}</p>
            <p><strong>Approved:</strong> {stays.filter(s => s.status === "approved").length}</p>
            <p><strong>Pending:</strong> {stays.filter(s => s.status === "pending").length}</p>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.centerContent}>
          {stays.length === 0 ? (
            <p style={styles.noData}>No stays available right now</p>
          ) : (
            <div style={styles.grid}>
              {stays.map((stay) => (
                <div key={stay._id} style={styles.card}>
                  {stay.images?.[0] && (
                    <div style={styles.imageWrapper}>
                      <img
                        src={stay.images[0].startsWith("http")
                          ? stay.images[0]
                          : `http://localhost:5000${stay.images[0]}`}
                        alt={stay.title}
                        style={styles.image}
                      />
                    </div>
                  )}
                  <div style={styles.cardBody}>
                    <h3 style={styles.title}>{stay.title}</h3>
                    <p style={styles.info}><strong>🏠 Type:</strong> {stay.type}</p>
                    <p style={styles.info}><strong>💰 Rent:</strong> ₹{stay.rent}</p>
                    {expandedId === stay._id && (
                      <>
                        <p style={styles.info}><strong>📍 Address:</strong> {stay.address}</p>
                        {stay.ownerId && (
                          <p style={styles.info}><strong>👤 Owner:</strong> {stay.ownerId.name}</p>
                        )}
                      </>
                    )}
                    <div style={styles.cardButtons}>
                      <button
                        onClick={() => setExpandedId(expandedId === stay._id ? null : stay._id)}
                        style={styles.viewButton}
                      >
                        {expandedId === stay._id ? "View Less" : "View More"}
                      </button>
                      {stay.ownerId && (
                        <button
                          onClick={() => handleContactOwner(stay._id)}
                          style={styles.contactButton}
                        >
                          Contact Owner
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map */}
          {stays.length > 0 && (
            <div style={{ height: "400px", marginTop: "20px", borderRadius: "12px", overflow: "hidden" }}>
              <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {stays.map((stay) => (
                  <Marker key={stay._id} position={[stay.lat || 20, stay.lng || 78]}>
                    <Popup>
                      <strong>{stay.title}</strong>
                      <p>{stay.address}</p>
                      <p>Rent: ₹{stay.rent}</p>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  pageWrapper: { padding: "0 20px", fontFamily: "Inter, sans-serif", background: "#f7f9fc" },
  headerSearchWrapper: { marginTop: "10px", marginBottom: "10px" },
  searchForm: { display: "flex", justifyContent: "center", gap: "8px" },
  searchInput: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", width: "250px" },
  searchButton: { padding: "8px 16px", borderRadius: "8px", border: "none", background: "#000", color: "#fff", cursor: "pointer" },
  mainContent: { display: "flex", gap: "0px" },
  sidebar: { width: "220px", background: "#fff", padding: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  sidebarHeading: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "10px" },
  sidebarList: { listStyle: "none", padding: 0, margin: 0 },
  sidebarItem: { padding: "8px 0", cursor: "pointer", fontWeight: "500", borderBottom: "1px solid #eee" },
  sidebarStats: { marginTop: "15px", fontSize: "0.9rem" },
  centerContent: { flex: 1, paddingLeft: "15px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
  card: { background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  imageWrapper: { width: "100%", height: "120px", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: "10px" },
  title: { fontSize: "1rem", fontWeight: "600", marginBottom: "5px" },
  info: { fontSize: "0.85rem", margin: "2px 0" },
  cardButtons: { display: "flex", gap: "5px", marginTop: "8px", flexWrap: "wrap" },
  viewButton: { padding: "5px 10px", fontSize: "0.8rem", borderRadius: "6px", border: "none", background: "#000", color: "#fff", cursor: "pointer" },
  contactButton: { padding: "5px 10px", fontSize: "0.8rem", borderRadius: "6px", background: "#000", color: "#fff", textDecoration: "none", display: "inline-block", cursor: "pointer" },
  noData: { textAlign: "center", color: "#64748b", fontSize: "1rem", marginTop: "20px" },
};
