import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import BookingForm from "../components/BookingForm";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredEvents = events.filter((event) => {
    const term = searchQuery.toLowerCase();
    return (
      event.event_name.toLowerCase().includes(term) ||
      event.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container">
      <Navbar />

      <div className="hero-section">
        <h2 className="hero-title">Welcome back, <span>{user?.name}</span> 👋</h2>
        <p className="hero-subtitle">Discover and book tickets for the most exciting department events, tech fests, and seminars going on right now.</p>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-input"
            placeholder="🔍 Search events by name or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="section-header">
        <h3>Available Events</h3>
        <div className="header-line"></div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>{events.length === 0 ? "No events available right now. Check back later! 🚀" : "No matching events found. 🤷‍♂️"}</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
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

              <BookingForm event={event} refreshEvents={fetchEvents} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;