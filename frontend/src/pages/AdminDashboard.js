import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin, getEvents, getAllBookings } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ events: 0, bookings: 0, revenue: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEvents(),
        getAllBookings()
      ]);
      
      const totalRevenue = bookingsRes.data
        .filter(b => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      setStats({
        events: eventsRes.data.length,
        bookings: bookingsRes.data.length,
        revenue: totalRevenue
      });
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  const handleCreateAdmin = async () => {
    setMessage("");
    setError("");
    
    if (!newAdmin.username || !newAdmin.password) {
      setError("Please fill in both username and password.");
      return;
    }

    try {
      const res = await createAdmin(newAdmin);
      setMessage("✅ " + res.data.message);
      setNewAdmin({ username: "", password: "" });
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Failed to create admin"));
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
      
      {/* Premium Topbar */}
      <div className="topbar" style={{ marginTop: "20px" }}>
        <div className="veltech-logo" style={{ margin: 0, fontSize: "1.5rem" }}>
          <span className="vel">Vel</span><span className="tech">tech</span>
        </div>
        <span style={{fontWeight: "700", color: "var(--veltech-blue)", fontSize: "1.1rem"}}>Admin Portal 👑</span>
        <button className="btn-danger" onClick={handleLogout} style={{ margin: 0 }}>
          Logout
        </button>
      </div>

      {/* Hero Stats Section */}
      <div className="hero-section" style={{ padding: "30px", flexDirection: "row", gap: "20px", flexWrap: "wrap", justifyContent: "space-around" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", color: "var(--veltech-red)", margin: "0" }}>{stats.events}</h2>
          <p style={{ color: "var(--text-muted)", margin: "5px 0 0 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Active Events</p>
        </div>
        <div style={{ width: "2px", backgroundColor: "var(--border-color)", alignSelf: "stretch" }}></div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", color: "var(--veltech-blue)", margin: "0" }}>{stats.bookings}</h2>
          <p style={{ color: "var(--text-muted)", margin: "5px 0 0 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Total Tickets</p>
        </div>
        <div style={{ width: "2px", backgroundColor: "var(--border-color)", alignSelf: "stretch" }}></div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#16a34a", margin: "0" }}>₹{stats.revenue}</h2>
          <p style={{ color: "var(--text-muted)", margin: "5px 0 0 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Total Revenue</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
        
        {/* Navigation Panel */}
        <div className="card" style={{ flex: "1.5", minWidth: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header">
              <h4>Quick Actions 🚀</h4>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Manage your university's events and student bookings.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <button 
                onClick={() => navigate("/admin/add-event")} 
                style={{ height: "100px", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", background: "linear-gradient(135deg, var(--veltech-red), #e63946)" }}
              >
                <span style={{ fontSize: "1.8rem", marginBottom: "5px" }}>➕</span> Add Event
              </button>
              
              <button 
                onClick={() => navigate("/admin/manage-events")} 
                className="btn-secondary" 
                style={{ height: "100px", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}
              >
                <span style={{ fontSize: "1.8rem", marginBottom: "5px" }}>🛠️</span> Manage Events
              </button>
              
              <button 
                onClick={() => navigate("/admin/bookings")} 
                className="btn-secondary" 
                style={{ height: "100px", margin: 0, gridColumn: "span 2", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem", background: "#0f172a" }}
              >
                <span style={{ fontSize: "1.5rem" }}>📄</span> View Bookings & Verify Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Create Admin Panel */}
        <div className="card" style={{ flex: "1", minWidth: "300px" }}>
          <div className="card-header">
            <h4>Security & Access 🛡️</h4>
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Register a new administrator to help manage the system.</p>
          
          {message && <div style={{ color: "#16a34a", padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", marginBottom: "15px", fontWeight: "500" }}>{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Username</label>
            <input
              type="text"
              placeholder="e.g. admin_cs"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              style={{ margin: "0 0 15px 0", width: "100%", boxSizing: "border-box" }}
            />
            
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              style={{ margin: "0 0 20px 0", width: "100%", boxSizing: "border-box" }}
            />
          </div>
          
          <button onClick={handleCreateAdmin} style={{ margin: 0 }}>Create Administrator</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;