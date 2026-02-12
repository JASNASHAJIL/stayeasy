import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API from "../api";

// Fix for default marker icon in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const colors = {
  bg: "#f8fafc",
  textPrimary: "#1e293b",
  primary: "#6366f1",
  white: "#ffffff",
  border: "#e2e8f0",
  textSecondary: "#64748b",
  professionalRed: '#c53030',
  professionalRedHover: '#9b2c2c',
};

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: colors.bg,
  },
  header: {
    height: "70px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  brand: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: colors.primary,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: colors.professionalRed,
    color: colors.white,
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  popupCard: {
    minWidth: "200px",
    fontFamily: "'Inter', sans-serif",
  },
  popupImage: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  popupTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: "4px",
    margin: "0 0 4px 0",
  },
  popupPrice: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: colors.primary,
    marginBottom: "8px",
  },
  popupInfo: {
    fontSize: "0.85rem",
    color: colors.textSecondary,
    marginBottom: "4px",
  },
};

const UserMapPage = () => {
  const [stays, setStays] = useState([]);
  const navigate = useNavigate();
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    API.get("/stay/search") // Fetch all approved stays
      .then((res) => {
        setStays(res.data.stays || []);
      })
      .catch((err) => {
        console.error("Failed to fetch stays for map", err);
      });
  }, []);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    if (img.startsWith("photo-")) return `https://images.unsplash.com/${img}?w=600&h=400&fit=crop`;
    return `${API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div style={styles.pageWrapper}>
      <header style={{
        ...styles.header,
        padding: isMobile ? "0 16px" : "0 32px",
        height: isMobile ? "60px" : "70px"
      }}>
        <div style={{
          ...styles.brand,
          fontSize: isMobile ? "1.2rem" : "1.4rem"
        }} onClick={() => navigate("/")}>
          <span>🗺️</span> {isMobile ? "Map" : "StayEase Map"}
        </div>
        <button 
          style={{
            ...styles.backButton,
            padding: isMobile ? "8px 12px" : "10px 20px",
            ...(isBackButtonHovered && { background: colors.professionalRedHover })
          }}
          onClick={() => navigate("/")}
          onMouseEnter={() => setIsBackButtonHovered(true)}
          onMouseLeave={() => setIsBackButtonHovered(false)}
        >
          {isMobile ? "← Back" : "← Back to List"}
        </button>
      </header>

      <div style={styles.mapContainer}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {stays.map((stay) =>
            stay.lat && stay.lng ? (
              <Marker key={stay._id} position={[stay.lat, stay.lng]}>
                <Popup>
                  <div style={styles.popupCard}>
                    <img 
                      src={getImageUrl(stay.images[0])} 
                      alt={stay.title} 
                      style={styles.popupImage} 
                    />
                    <h3 style={styles.popupTitle}>{stay.title}</h3>
                    <div style={styles.popupPrice}>₹{stay.rent.toLocaleString()}</div>
                    <div style={styles.popupInfo}>{stay.type} • {stay.gender}</div>
                    <div style={styles.popupInfo}>📍 {stay.address}</div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default UserMapPage;