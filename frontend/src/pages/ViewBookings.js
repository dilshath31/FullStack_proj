import { useEffect, useState } from "react";
import { getAllBookings, validateTicket } from "../services/api";
import { useNavigate } from "react-router-dom";

function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [ticketIdToValidate, setTicketIdToValidate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  const handleValidate = async () => {
    if(!ticketIdToValidate) return;
    try {
      const res = await validateTicket({ ticket_id: ticketIdToValidate });
      alert(res.data.message);
      setTicketIdToValidate("");
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Validation failed");
    }
  };

  return (
    <div className="container">
      
      <div className="topbar">
        <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
        <span style={{fontWeight: "700", color: "var(--veltech-blue)", fontSize: "1.1rem"}}>Booking Records</span>
        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="section-header">
        <h3>Validate Ticket</h3>
        <div className="header-line"></div>
      </div>
      
      <div className="card" style={{padding: '20px', marginBottom: '30px'}}>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input 
            type="text" 
            placeholder="Enter Ticket ID (e.g. 5f3d...)" 
            className="search-input" 
            style={{margin: 0, flex: 1}}
            value={ticketIdToValidate}
            onChange={(e) => setTicketIdToValidate(e.target.value)}
          />
          <button className="btn-primary" onClick={handleValidate} style={{margin: 0, padding: '12px 20px'}}>
            Verify & Admit
          </button>
        </div>
      </div>

      <div className="section-header">
        <h3>All Bookings</h3>
        <div className="header-line"></div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No transactions have been made yet.</p>
        </div>
      ) : (
        <div className="events-grid">
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <div className="card-header">
              <h4>{b.name}</h4>
              <span className="badge price-badge">VT-{b.id}</span>
            </div>
            
            <div className="card-body">
              <p className="detail-item"><strong>📧 Email:</strong> <span>{b.email}</span></p>
              <p className="detail-item"><strong>🎟️ Event:</strong> <span className="badge dept-badge">{b.event_name}</span></p>
              <p className="detail-item"><strong>🎫 QTY:</strong> <span>{b.tickets} tickets</span></p>
              <p className="detail-item"><strong>🆔 Ticket ID:</strong> <span style={{fontFamily: "monospace"}}>{b.ticket_id ? b.ticket_id.split('-')[0].toUpperCase() : `VT-${b.id}`}</span></p>
              <p className="detail-item"><strong>📊 Status:</strong> <span style={{color: b.status === 'Cancelled' ? 'red' : 'green'}}>{b.status || 'Booked'}</span></p>
              <p className="detail-item"><strong>✅ Used:</strong> <span>{b.is_used ? 'Yes' : 'No'}</span></p>
              
              <div className="divider"></div>
              
              <p className="detail-item" style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                <strong>Total Revenue:</strong> 
                <span style={{color: 'var(--veltech-red)', fontWeight: 'bold', fontSize: '1.2rem'}}>₹{b.total_amount}</span>
              </p>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default ViewBookings;