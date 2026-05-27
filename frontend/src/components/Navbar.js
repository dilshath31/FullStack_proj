import { useNavigate } from "react-router-dom";

function Navbar({ isAdmin }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="topbar">
      {!isAdmin && (
        <>
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/my-bookings")}>My Bookings</button>
        </>
      )}

      {isAdmin && (
        <>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin/manage-events")}>Events</button>
          <button onClick={() => navigate("/admin/bookings")}>Bookings</button>
        </>
      )}

      <button className="btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;