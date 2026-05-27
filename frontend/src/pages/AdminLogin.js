import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!form.username || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await adminLogin(form);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel" style={{backgroundImage: "linear-gradient(135deg, rgba(175, 6, 6, 0.95), rgba(2, 100, 102, 0.95)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80')"}}>
        <h1>Administrative Portal</h1>
        <p>Secure access for Veltech University administrators to manage events and student bookings.</p>
      </div>
      
      <div className="auth-form-panel">
        <div className="veltech-logo-container" style={{boxShadow: "none", border: "none", marginBottom: "10px", padding: "0"}}>
            <h1 className="veltech-logo"><span className="vel">Vel</span><span className="tech">Tech</span></h1>
            <p style={{fontSize: "0.85em", color: "var(--veltech-red)", fontWeight: "bold"}}>Administrative Access Terminal</p>
        </div>

        <div className="auth-card">
          <h2>Secure Login</h2>
          
          {error && <div className="error-message">{error}</div>}

          <input
            type="text"
            placeholder="Admin ID or Username"
            className="search-input"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Security Pin"
            className="search-input"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button onClick={handleLogin}>Authenticate</button>

          <div className="divider"></div>

          <p className="center-link" onClick={() => navigate("/")} style={{color: "var(--text-muted)"}}>
            Return to Student Login
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;