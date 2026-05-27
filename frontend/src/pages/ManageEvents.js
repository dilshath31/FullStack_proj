import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/api";
import { useNavigate } from "react-router-dom";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      alert("Error deleting event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="container">
      
      <div className="topbar">
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" style={{ margin: 0 }} onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </button>
          <button style={{ margin: 0 }} onClick={() => navigate("/admin/add-event")}>
            ➕ Create Event
          </button>
        </div>
        <span style={{fontWeight: "700", color: "var(--veltech-blue)", fontSize: "1.1rem"}}>Event Management</span>
        <button className="btn-danger" style={{ margin: 0 }} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="section-header">
        <h3>Current Events</h3>
        <div className="header-line"></div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events available. Create a new event from the dashboard.</p>
        </div>
      ) : (
        <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="card">
            <div className="card-header">
              <h4>{event.event_name}</h4>
              <span className="badge price-badge">₹{event.price}</span>
            </div>
            
            <div className="card-body">
              <p className="detail-item"><strong>🏛️ Dept:</strong> <span className="badge dept-badge">{event.department}</span></p>
              <p className="detail-item"><strong>📅 Date:</strong> <span>{new Date(event.event_date).toLocaleDateString()}</span></p>
              <p className="detail-item"><strong>📍 Venue:</strong> <span>{event.venue}</span></p>
              
              <div className="availability">
                <div className="availability-bar-bg">
                  <div 
                    className="availability-bar-fill" 
                    style={{ width: `${Math.min(100, (event.available_tickets / 100) * 100)}%` }}
                  ></div>
                </div>
                <p><strong>{event.available_tickets}</strong> tickets left</p>
              </div>
            </div>

            <div className="divider"></div>

            <button
              onClick={() => handleDelete(event.id)}
              className="btn-danger"
            >
              Delete Event
            </button>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default ManageEvents;