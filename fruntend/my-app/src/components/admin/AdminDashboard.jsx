import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // check path
import { StayContext } from "../../context/StayContext";

// ---------------- STYLES ----------------
const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "40px",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
    background: "#e2e8f0",
    borderRadius: "12px",
    padding: "6px",
    maxWidth: "400px",
    margin: "0 auto 40px auto",
  },
  tab: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
    fontSize: "1rem",
  },
  activeTab: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#ffffff",
    color: "#1e3a8a",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontSize: "1rem",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "10px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    border: "1px solid #e2e8f0",
  },
  ownersPageLayout: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "40px",
    alignItems: "flex-start",
  },
  ownerListContainer: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    maxHeight: "70vh",
    overflowY: "auto",
  },
  ownerListItem: {
    padding: "15px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "8px",
    border: "1px solid transparent",
  },
  ownerDetailContainer: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  stayCard: {
    background: "#f8fafc",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    justifyContent: "center",
  },
  approveBtn: {
    background: "#10b981",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  rejectBtn: {
    background: "#f43f5e",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  noData: {
    padding: "40px",
    textAlign: "center",
    fontStyle: "italic",
    color: "#64748b",
    background: "#f8fafc",
    borderRadius: "12px",
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
      const res = await API.put(`/admin/stays/${stayId}/approve`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
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
      const res = await API.put(`/admin/stays/${stayId}/reject`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
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
                  <h3 style={{ margin: '0 0 8px 0' }}>{u.name}</h3>
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
          <h2 style={styles.sectionTitle}>Owner Management</h2>
          <div style={styles.ownersPageLayout}>
            <div style={styles.ownerListContainer}>
              {owners.length === 0 ? (
                <p style={styles.noData}>No owners found.</p>
              ) : (
                owners.map((o) => (
                  <div
                    key={o._id}
                    style={{
                      ...styles.ownerListItem,
                      background: selectedOwner?._id === o._id ? "#eef2ff" : "transparent",
                      border: selectedOwner?._id === o._id ? "1px solid #c7d2fe" : "1px solid transparent",
                    }}
                    onClick={() => {
                      setSelectedOwner(o);
                      fetchOwnerStays(o._id);
                    }}
                  >
                    <h3 style={{ margin: '0 0 8px 0' }}>{o.name}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>{o.phone}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600', color: o.status === 'approved' ? '#16a34a' : o.status === 'rejected' ? '#dc2626' : '#ca8a04' }}>
                      Status: {o.status || "pending"}
                    </p>
                    {o.status === "pending" && (
                      <div style={styles.buttonContainer}>
                        <button
                          style={styles.approveBtn}
                          onClick={(e) => { e.stopPropagation(); handleApproveOwner(o._id); }}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={(e) => { e.stopPropagation(); handleRejectOwner(o._id); }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={styles.ownerDetailContainer}>
              {selectedOwner ? (
                <>
                  <h2 style={{...styles.sectionTitle, border: 'none', padding: 0}}>Stays by {selectedOwner.name}</h2>
                  {ownerStays.length === 0 ? (
                    <p style={styles.noData}>No stays found for this owner.</p>
                  ) : (
                    ownerStays.map((stay) => (
                      <div key={stay._id} style={styles.stayCard}>
                        <h3 style={{ margin: '0 0 8px 0' }}>{stay.title}</h3>
                        <p>Rent: ₹{stay.rent}</p>
                        <p>Status: {stay.status}</p>
                        {stay.status === "pending" && (
                          <div style={styles.buttonContainer}>
                            <button
                              style={styles.approveBtn}
                              onClick={() => handleApproveStay(stay._id, selectedOwner._id)}
                            >
                              Approve Stay
                            </button>
                            <button
                              style={styles.rejectBtn}
                              onClick={() => handleRejectStay(stay._id, selectedOwner._id)}
                            >
                              Reject Stay
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              ) : (
                <div style={styles.noData}>Select an owner to view their stays.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
