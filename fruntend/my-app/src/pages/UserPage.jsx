import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API from "../api";
import Footer from "../components/Footer";
import { StayContext } from "../context/StayContext";

const colors = {
  bg: "#f8fafc", // Slate-50
  cardBg: "#ffffff",
  textPrimary: "#1e293b", // Slate-800
  textSecondary: "#64748b", // Slate-500
  primary: "#6366f1", // Indigo-500
  primaryHover: "#4f46e5", // Indigo-600
  border: "#e2e8f0", // Slate-200
  success: "#10b981", // Emerald-500
  successBg: "#ecfdf5", // Emerald-50
  danger: "#ef4444", // Red-500
  dangerBg: "#fef2f2", // Red-50
  white: "#fff",
  accent: "#f59e0b", // Amber-500
  professionalRed: "#c53030",
  professionalRedHover: "#9b2c2c",
};

const styles = {
  pageWrapper: {
    background: colors.bg,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: colors.textPrimary,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  actionBar: {
    background: colors.bg,
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
    gap: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  searchForm: {
    display: "flex",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    borderRadius: "12px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "12px 0 0 12px",
    border: `1px solid ${colors.border}`,
    borderRight: "none",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    background: colors.white,
  },
  searchButton: {
    padding: "12px 28px",
    borderRadius: "0 12px 12px 0",
    border: "none",
    background: colors.professionalRed,
    color: colors.white,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "background-color 0.2s",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navItem: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: colors.textSecondary,
    cursor: "pointer",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  filterBar: {
    display: 'flex',
    gap: '16px',
    padding: '24px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  filterGroup: {
    flex: 1,
    minWidth: '200px',
  },
  mainContent: {
    padding: "0 24px 40px",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
    flex: 1,
  },
  filterLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: '12px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  filterSelect: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    fontSize: '0.95rem',
    background: colors.white,
    color: colors.textPrimary,
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3F%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px',
  },
  statusBox: (isSubscribed) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    background: isSubscribed ? colors.successBg : colors.dangerBg,
    color: isSubscribed ? colors.success : colors.danger,
    border: `1px solid ${isSubscribed ? colors.success : colors.danger}20`,
  }),
  centerContent: {
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    background: colors.cardBg,
    borderRadius: "20px",
    overflow: "hidden",
    border: `1px solid ${colors.border}`,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: "240px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.bg,
  },
  priceTag: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "8px 16px",
    borderRadius: "30px",
    fontWeight: "700",
    color: colors.primary,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 10,
    backdropFilter: "blur(4px)",
  },
  cardBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "700",
    marginBottom: "12px",
    color: colors.textPrimary,
    lineHeight: 1.4,
  },
  badges: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: colors.textSecondary,
    fontSize: "0.9rem",
    marginBottom: "8px",
  },
  cardButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "auto",
    paddingTop: "20px",
  },
  buttonBase: {
    padding: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  primaryButton: {
    background: colors.professionalRed,
    color: colors.white,
    boxShadow: "0 4px 12px rgba(197, 48, 48, 0.2)",
  },
  secondaryButton: {
    background: colors.professionalRed,
    color: colors.white,
    border: `1px solid ${colors.professionalRed}`,
  },
  viewMoreBtn: {
    gridColumn: "1 / -1",
    background: "transparent",
    color: colors.professionalRed,
    border: `1px dashed ${colors.professionalRed}`,
    marginTop: "8px",
    fontSize: "0.85rem",
  },
  noData: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: "1.1rem",
    marginTop: "40px",
    padding: "40px",
    background: colors.cardBg,
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px 20px",
    background: colors.dangerBg,
    borderRadius: "12px",
    color: colors.danger,
  },
  errorText: {
    marginBottom: "16px",
    fontWeight: "500",
    fontSize: "1.1rem",
  },
  retryButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: `1px solid ${colors.professionalRed}`,
    background: colors.professionalRed,
    color: colors.white,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  mapContainer: {
    height: "400px",
    marginTop: "24px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
};

// Use environment variable for API URL in production, fallback to localhost for dev
const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/600x400?text=No+Image";
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  if (img.startsWith("photo-")) return `https://images.unsplash.com/${img}?w=600&h=400&fit=crop`;
  return `${API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};

const ImageSlider = ({ images = [], title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, images.length, hasMultipleImages]);

  const goToPrevious = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (e, slideIndex) => {
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  const sliderStyles = {
    height: '100%',
    position: 'relative',
    transition: 'transform 0.4s ease',
  };

  const arrowStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    cursor: 'pointer',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    fontSize: '1.5rem',
    opacity: 0,
    transition: 'opacity 0.3s',
  };

  const dotsContainerStyles = {
    position: 'absolute',
    bottom: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  };

  const dotStyle = (index) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: index === currentIndex ? colors.white : 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'background 0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  });

  const handleSliderHover = (e) => {
    if (!hasMultipleImages) return;
    const arrows = e.currentTarget.querySelectorAll('.slider-arrow');
    arrows.forEach(arrow => arrow.style.opacity = e.type === 'mouseenter' ? 1 : 0);
  };

  return (
    <div style={{ height: '100%', position: 'relative' }} onMouseEnter={handleSliderHover} onMouseLeave={handleSliderHover}>
      <div style={sliderStyles} className="image-slider">
        {hasMultipleImages && (
          <>
            <button className="slider-arrow" style={{ ...arrowStyles, left: '15px' }} onClick={goToPrevious}>‹</button>
            <button className="slider-arrow" style={{ ...arrowStyles, right: '15px' }} onClick={goToNext}>›</button>
            <div style={dotsContainerStyles}>
              {images.map((_, slideIndex) => (
                <div key={slideIndex} style={dotStyle(slideIndex)} onClick={(e) => goToSlide(e, slideIndex)} />
              ))}
            </div>
          </>
        )}
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {images.length > 0 ? (
            images.map((img, index) => (
              <div key={index} style={{ width: '100%', height: '100%', backgroundPosition: 'center', backgroundSize: 'cover', backgroundImage: `url(${getImageUrl(img)})`, transition: 'opacity 0.8s ease-in-out', opacity: index === currentIndex ? 1 : 0, position: 'absolute', top: 0, left: 0 }} />
            ))
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundPosition: 'center', backgroundSize: 'cover', backgroundImage: `url(https://placehold.co/600x400?text=No+Image)` }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default function UserPage() {
  const [stays, setStays] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [filters, setFilters] = useState({
    type: 'all',
    gender: 'all',
    rent: 'all',
  });
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(StayContext);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isRetryHovered, setIsRetryHovered] = useState(false);
  const [isMapLinkHovered, setIsMapLinkHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStays = () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (activeSearch) {
      params.append("title", activeSearch);
    }
    if (filters.type && filters.type !== 'all') {
      params.append("type", filters.type);
    }
    if (filters.gender && filters.gender !== 'all') {
      params.append("gender", filters.gender);
    }
    if (filters.rent && filters.rent !== 'all') {
      const [minRent, maxRent] = filters.rent.split('-');
      params.append("minRent", minRent);
      if (maxRent) params.append("maxRent", maxRent);
    }

    const url = `/stay/search?${params.toString()}`;

    API.get(url)
      .then((res) => {
        setStays(res.data.stays || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch stays. Please ensure the backend is running and check your connection.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStays();
  }, [filters, activeSearch]); // Refetch when filters or the active search term change

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(search); // On search submit, update the active search term
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // ---------------- Contact Owner with login & subscription check ----------------
  const handleContactOwner = async (stayId) => {
    if (!user?.token) {
      // Not logged in → redirect to login
      navigate("/login", { state: { redirectTo: `/` } });
      return;
    }

    if (!user.isSubscribed) {
      navigate("/subscribe", { state: { redirectTo: "/" } });
      return;
    }

    try {
      const res = await API.get(`/stay/contact/${stayId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // ✅ Show number so user can see/copy it
      alert(`Owner Contact Details:\n\nName: ${res.data.ownerName}\nPhone: ${res.data.phone}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to contact owner");
    }
  };

  // ---------------- Start Chat with login & subscription check ----------------
  const handleStartChat = async (stayId) => {
    if (!user?.token) {
      navigate("/login", { state: { redirectTo: "/" } });
      return;
    }

    if (!user.isSubscribed) {
      navigate("/subscribe", { state: { redirectTo: `/chat/${stayId}` } });
      return;
    }

    try {
      // Create or get existing room
      await API.post("/chat/start", { stayId }, { headers: { Authorization: `Bearer ${user.token}` } });
      navigate(`/chat/${stayId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start chat. Is the backend server running?");
    }
  };

  const handleSidebarItemHover = (e) => {
    if (e.type === 'mouseenter') {
      e.currentTarget.style.backgroundColor = colors.bg;
      e.currentTarget.style.color = colors.primary;
    } else {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = colors.textPrimary;
    }
  };

  const handleCardHover = (e) => {
    const card = e.currentTarget;
    const imageSlider = card.querySelector('.image-slider');
    if (e.type === 'mouseenter') {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      if (imageSlider) imageSlider.style.transform = 'scale(1.05)';
    } else {
      card.style.transform = 'none';
      card.style.boxShadow = styles.card.boxShadow;
      if (imageSlider) imageSlider.style.transform = 'scale(1)';
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Search & Actions Bar */}
      <div style={styles.actionBar}>

        <form onSubmit={handleSearch} style={{
          ...styles.searchForm,
          order: isMobile ? 2 : 0,
          maxWidth: isMobile ? '100%' : '480px',
          margin: isMobile ? '8px 0' : '0'
        }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
          <button 
            type="submit" 
            style={{
              ...styles.searchButton,
              ...(isSearchHovered && { backgroundColor: colors.professionalRedHover })
            }}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            Search
          </button>
        </form>

        <div style={styles.navRight}>
          <span
            style={{
              ...styles.navItem,
              ...(isMapLinkHovered && { color: colors.primary })
            }}
            onClick={() => navigate("/map")}
            onMouseEnter={() => setIsMapLinkHovered(true)}
            onMouseLeave={() => setIsMapLinkHovered(false)}
          >
            🗺️ Map View
          </span>
          {user ? (
            <>
              <div style={styles.statusBox(user.isSubscribed)}>
                {user.isSubscribed ? "Premium Plan" : "Free Plan"}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Property Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange} style={styles.filterSelect}>
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
            <option value="Room">Room</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>For</label>
          <select name="gender" value={filters.gender} onChange={handleFilterChange} style={styles.filterSelect}>
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Rent Range (₹)</label>
          <select name="rent" value={filters.rent} onChange={handleFilterChange} style={styles.filterSelect}>
            <option value="all">All Prices</option>
            <option value="0-5000">Under 5,000</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000-15000">10,000 - 15,000</option>
            <option value="15000-999999">Over 15,000</option>
          </select>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Main Content */}
        <div style={styles.centerContent}>
          {loading && <p style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem" }}>Loading stays...</p>}
          {error && (
            <div style={styles.errorContainer}>
              <p style={styles.errorText}>{error}</p>
              <button 
                onClick={fetchStays} 
                style={{
                  ...styles.retryButton,
                  ...(isRetryHovered && { background: colors.professionalRedHover })
                }}
                onMouseEnter={() => setIsRetryHovered(true)}
                onMouseLeave={() => setIsRetryHovered(false)}
              >
                Retry Connection
              </button>
            </div>
          )}

          {!loading && !error && (stays.length === 0 ? (
            <p style={styles.noData}>No stays match your criteria. Try adjusting the filters.</p>
          ) : (
            <>
              <div style={styles.grid}>
                {stays.map((stay) => (
                  <div 
                    key={stay._id} 
                    style={styles.card}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHover}
                  >
                    <div style={styles.imageWrapper}>
                      <div style={styles.priceTag}>₹{stay.rent.toLocaleString()}</div>
                      <ImageSlider images={stay.images} title={stay.title} />
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.badges}>
                        <span style={{ ...styles.badge, background: colors.bg, color: colors.textSecondary }}>
                          {stay.type}
                        </span>
                        <span style={{ ...styles.badge, background: stay.gender === 'female' ? '#fce7f3' : stay.gender === 'male' ? '#e0f2fe' : '#f3f4f6', color: stay.gender === 'female' ? '#be185d' : stay.gender === 'male' ? '#0369a1' : '#374151' }}>
                          {stay.gender.charAt(0).toUpperCase() + stay.gender.slice(1)}
                        </span>
                      </div>
                      
                      <h3 style={styles.title}>{stay.title}</h3>
                      
                      <div style={styles.infoRow}>
                        <span>📍</span> {stay.address}
                      </div>

                      {expandedId === stay._id && (
                        <>
                          {stay.ownerId && (
                            <div style={styles.infoRow}>
                              <span>👤</span> Owner: {stay.ownerId.name}
                            </div>
                          )}
                          {stay.images && stay.images.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px' }}>Photos</p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {stay.images.slice(0, 4).map((img, idx) => (
                                  <div 
                                    key={idx}
                                    style={{ 
                                      aspectRatio: '1', 
                                      borderRadius: '8px', 
                                      overflow: 'hidden', 
                                      border: `1px solid ${colors.border}`,
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => { e.stopPropagation(); window.open(getImageUrl(img), '_blank'); }}
                                  >
                                    <img src={getImageUrl(img)} alt="Stay preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div style={styles.cardButtons}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleContactOwner(stay._id); }}
                          style={{ ...styles.buttonBase, ...styles.secondaryButton }}
                        >
                          📞 Contact
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartChat(stay._id); }}
                          style={{ ...styles.buttonBase, ...styles.primaryButton }}
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === stay._id ? null : stay._id);
                          }}
                          style={{ ...styles.buttonBase, ...styles.viewMoreBtn }}
                        >
                          {expandedId === stay._id ? "View Less" : "View More"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              {stays.length > 0 && (
                <div style={styles.mapContainer}>
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
            </>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
