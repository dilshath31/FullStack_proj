import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";

function AddEvent() {
  const [form, setForm] = useState({
    event_name: "",
    department: "",
    event_date: "",
    venue: "",
    price: "",
    available_tickets: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    
    if (
      !form.event_name ||
      !form.department ||
      !form.event_date ||
      !form.venue ||
      !form.price ||
      !form.available_tickets
    ) {
      setError("All fields required");
      return;
    }

    try {
      const res = await createEvent(form);
      setSuccess(res.data.message);

      setTimeout(() => {
          navigate("/admin/dashboard");
      }, 1500);

    } catch (err) {
      setError("Error adding event. Verify details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="container">
      
      <div className="topbar">
        <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
        <span style={{fontWeight: "700", color: "var(--veltech-blue)", fontSize: "1.1rem"}}>Administrative Actions</span>
        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-panel" style={{ maxWidth: "500px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
           <h2 style={{marginTop: "0", color: "var(--veltech-blue)", display: "inline-block", fontSize: "1.6rem"}}>Create New Event</h2>
           <p style={{ color: "var(--text-muted)", marginTop: "5px", fontSize: "0.95rem" }}>Publish an official Veltech University event.</p>
        </div>
        
        {error && <div className="error-message" style={{textAlign: "center"}}>{error}</div>}
        {success && <div className="error-message" style={{background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", textAlign: "center"}}>{success}</div>}

        <div style={{ textAlign: "left" }}>
          
          <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600"}}>Event Title</label>
          <input
            placeholder="e.g. AI Hackathon 2026"
            className="search-input"
            value={form.event_name}
            onChange={(e) => setForm({ ...form, event_name: e.target.value })}
          />

          <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginTop: "15px", display: "block"}}>Hosting Department</label>
          <input
            placeholder="e.g. Computer Science"
            className="search-input"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

          <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginTop: "15px", display: "block"}}>Date & Time</label>
          <input
            type="datetime-local"
            className="search-input"
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          />

          <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginTop: "15px", display: "block"}}>Venue / Location</label>
          <input
            placeholder="e.g. Main Auditorium"
            className="search-input"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />

          <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", display: "block"}}>Price (₹)</label>
              <input
                type="number"
                placeholder="0"
                className="search-input"
                value={form.price}
                style={{ width: "calc(100% - 40px)", marginTop: "8px" }}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", display: "block"}}>Total Seats</label>
              <input
                type="number"
                placeholder="100"
                className="search-input"
                value={form.available_tickets}
                style={{ width: "calc(100% - 40px)", marginTop: "8px" }}
                onChange={(e) => setForm({ ...form, available_tickets: e.target.value })}
              />
            </div>
          </div>

          <button onClick={handleSubmit} style={{ marginTop: "30px", fontSize: "1.1rem", padding: "14px" }}>
            Create Event
          </button>
        </div>

      </div>

    </div>
  );
}

export default AddEvent;