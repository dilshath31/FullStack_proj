import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await loginUser(form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel">
        <h1>Welcome to Veltech</h1>
        <p>Your portal for all department events, technical fests, and exclusive campus seminars.</p>
      </div>
      
      <div className="auth-form-panel">
        <div className="veltech-logo-container" style={{boxShadow: "none", border: "none", marginBottom: "10px", padding: "0"}}>
            <h1 className="veltech-logo"><span className="vel">Vel</span><span className="tech">Tech</span></h1>
            <p style={{fontSize: "0.85em"}}>Department Event Platform</p>
        </div>

        <div className="auth-card">
          <h2>Student Login</h2>
          
          {error && <div className="error-message">{error}</div>}

          <input
            type="email"
            placeholder="Official Email Address"
            className="search-input"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="search-input"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button onClick={handleLogin}>Secure Login</button>

          <p className="center-link" onClick={() => navigate("/register")}>
            Don't have an account? Register here.
          </p>
          
          <div className="divider"></div>

          <p className="center-link" onClick={() => navigate("/admin")} style={{color: "var(--veltech-red)", fontSize: "0.9rem"}}>
            Administrators Login
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;