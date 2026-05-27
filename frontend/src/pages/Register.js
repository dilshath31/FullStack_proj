import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOTP } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      alert(res.data.message);
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    if (!form.otp) {
      setError("OTP is required");
      return;
    }

    try {
      const res = await verifyOTP({ email: form.email, otp: form.otp });
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image-panel" style={{backgroundImage: "linear-gradient(135deg, rgba(175, 6, 6, 0.9), rgba(2, 100, 102, 0.9)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80')"}}>
        <h1>Join Veltech Events</h1>
        <p>Register once to get instant access to hundreds of seminars and department technical fests.</p>
      </div>
      
      <div className="auth-form-panel">
        <div className="veltech-logo-container" style={{boxShadow: "none", border: "none", marginBottom: "10px", padding: "0"}}>
            <h1 className="veltech-logo"><span className="vel">Vel</span><span className="tech">Tech</span></h1>
            <p style={{fontSize: "0.85em"}}>Department Event Platform</p>
        </div>

        <div className="auth-card">
          <h2>Student Registration</h2>
          
          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="search-input"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Official Email Address"
                className="search-input"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Choose Password"
                className="search-input"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button onClick={handleRegister}>Register Account</button>
            </>
          ) : (
            <>
              <p>An OTP has been sent to your email address: {form.email}</p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="search-input"
                maxLength="6"
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
              <button onClick={handleVerifyOTP}>Verify Account</button>
            </>
          )}

          <p className="center-link" onClick={() => navigate("/")}>
            Already have an account? Login here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;