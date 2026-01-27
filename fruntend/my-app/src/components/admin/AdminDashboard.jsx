import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // check path
import { StayContext } from "../../context/StayContext";

// ---------------- STYLES ----------------
const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f8ff, #e6f7ff)",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#1e3a8a",
    marginBottom: "30px",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    gap: "20px",
  },
  tab: {
    padding: "10px 25px",
    borderRadius: "8px",
    border: "none",
    background: "#38bdf8",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  activeTab: {
    padding: "10px 25px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#1e3a8a",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#a5f3fc",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
  },
  ownersContainer: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },
  ownerStays: {
    flex: 1,
    minWidth: "300px",
  },
  stayCard: {
    background: "#fcd34d",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    justifyContent: "center",
  },
  approveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  rejectBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  noData: {
    fontStyle: "italic",
    color: "#334155",
  },
};

// ---------------- COMPONENT ----------------
export default function AdminDashboard() {
  const { user } = useContext(StayContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerStays, setOwnerStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    if (!user?.token) return;
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ---------------- FETCH OWNERS ----------------
  const fetchOwners = async () => {
    if (!user?.token) return;
    try {
      const res = await API.get("/admin/owners", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) setOwners(res.data.owners || []);
      console.log("stay",res);
      
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  };

  // ---------------- FETCH OWNER STAYS ----------------
  const fetchOwnerStays = async (ownerId) => {
  try {
    const res = await API.get(`/admin/owner-stays/${ownerId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.data.success) {
      setOwnerStays(res.data.stays || []);
    }
  } catch (err) {
    console.error("Error fetching owner stays:", err);
  }
};

  // ---------------- APPROVE / REJECT STAY ----------------
  const handleApproveStay = async (stayId, ownerId) => {
    try {
      const res = await API.put(`/admin/approve-stay/${stayId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        alert("Stay approved");
        fetchOwnerStays(ownerId);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve stay");
    }
  };

  const handleRejectStay = async (stayId, ownerId) => {
    try {
      const res = await API.put(`/admin/reject-stay/${stayId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        alert("Stay rejected");
        fetchOwnerStays(ownerId);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reject stay");
    }
  };

  // ---------------- APPROVE / REJECT OWNER ----------------
  const handleApproveOwner = async (ownerId) => {
    try {
      const res = await API.put(`/admin/approve-owner/${ownerId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        alert("Owner approved");
        fetchOwners();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve owner");
    }
  };

  const handleRejectOwner = async (ownerId) => {
    try {
      const res = await API.put(`/admin/reject-owner/${ownerId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        alert("Owner rejected");
        fetchOwners();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reject owner");
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    fetchUsers();
    fetchOwners();
    setLoading(false);
  }, [user?.token]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Tab buttons */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "users" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          style={activeTab === "owners" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("owners")}
        >
          Owners
        </button>
      </div>

      {loading && <p style={styles.noData}>Loading...</p>}

      {/* ---------- USERS TAB ---------- */}
      {activeTab === "users" && (
        <div>
          <h2 style={styles.sectionTitle}>All Users</h2>
          <div style={styles.cardGrid}>
            {users.length === 0 ? (
              <p style={styles.noData}>No users found.</p>
            ) : (
              users.map((u) => (
                <div key={u._id} style={styles.card}>
                  <h3>{u.name}</h3>
                  <p>Username: {u.username}</p>
                  <p>Phone: {u.phone}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------- OWNERS TAB ---------- */}
      {activeTab === "owners" && (
        <div>
          <h2 style={styles.sectionTitle}>All Owners</h2>
          <div style={styles.cardGrid}>
            {owners.length === 0 ? (
              <p style={styles.noData}>No owners found.</p>
            ) : (
              owners.map((o) => (
                <div
                  key={o._id}
                  style={{
                    ...styles.card,
                    border: selectedOwner?._id === o._id ? "3px solid #0f172a" : "none",
                  }}
                >
                  <h3>{o.name}</h3>
                  <p>Username: {o.username}</p>
                  <p>Phone: {o.phone}</p>
                  <p>Status: {o.status || "pending"}</p>

                  {/* Owner Approve/Reject */}
                  {o.status === "pending" && (
                    <div style={styles.buttonContainer}>
                      <button
                        style={styles.approveBtn}
                        onClick={() => handleApproveOwner(o._id)}
                      >
                        Approve
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => handleRejectOwner(o._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    style={{ marginTop: "10px", ...styles.tab }}
                    onClick={() => {
                      setSelectedOwner(o);
                      fetchOwnerStays(o._id);
                    }}
                  >
                    View Stays
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Owner stays */}
          {selectedOwner && (
            <div style={styles.ownerStays}>
              <h2>Stays by {selectedOwner.name}</h2>
              {ownerStays.length === 0 ? (
                <p style={styles.noData}>No stays found.</p>
              ) : (
                ownerStays.map((stay) => (
                  <div key={stay._id} style={styles.stayCard}>
                    <h3>{stay.title}</h3>
                    <p>Type: {stay.type}</p>
                    <p>Rent: ₹{stay.rent}</p>
                    <p>Address: {stay.address}</p>
                    <p>Status: {stay.status}</p>
                    {stay.status === "pending" && (
                      <div style={styles.buttonContainer}>
                        <button
                          style={styles.approveBtn}
                          onClick={() => handleApproveStay(stay._id, selectedOwner._id)}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={() => handleRejectStay(stay._id, selectedOwner._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
