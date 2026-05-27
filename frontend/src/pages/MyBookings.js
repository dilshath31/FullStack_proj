import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../services/api";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings(user.id);
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const res = await cancelBooking(id);
        alert(res.data.message);
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="section-header" style={{ marginTop: '20px' }}>
        <h3>My Tickets 🎟️</h3>
        <div className="header-line"></div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any tickets yet. Head over to the home page to find events!</p>
        </div>
      ) : (
        <div className="events-grid">
          {bookings.map((b) => (
            <div key={b.id} className="boarding-pass">
              <div className="boarding-pass-header">
                <span>{b.event_name || `Event #${b.event_id}`}</span>
                <span>Qty: {b.tickets}</span>
              </div>
              
              <div className="boarding-pass-body">
                <div className="pass-row">
                  <div className="pass-col">
                    <label>Passenger Name</label>
                    <span>{b.name}</span>
                  </div>
                  <div className="pass-col" style={{ textAlign: "right" }}>
                    <label>Status</label>
                    <span style={{ color: b.status === 'Cancelled' ? 'red' : 'green' }}>{b.status || 'Booked'}</span>
                  </div>
                </div>
                
                <div className="pass-row">
                  <div className="pass-col">
                    <label>Total Paid</label>
                    <span style={{ color: "var(--veltech-red)" }}>₹{b.total_amount}</span>
                  </div>
                  <div className="pass-col" style={{ textAlign: "right" }}>
                    <label>Ticket ID</label>
                    <span style={{fontSize: "0.7em"}}>{b.ticket_id ? b.ticket_id.split('-')[0] : `VT-${b.id}`}</span>
                  </div>
                </div>
              </div>

              <div className="boarding-pass-separator"></div>

              <div className="boarding-pass-footer" style={{flexDirection: "column", alignItems: "center", paddingBottom: "15px"}}>
                {b.qr_code && b.status !== 'Cancelled' ? (
                  <img src={b.qr_code} alt="QR Code" style={{ width: "100px", height: "100px", marginBottom: "10px" }} />
                ) : (
                  <div className="barcode-stub" style={{marginBottom: "10px"}}></div>
                )}
                
                {b.status !== 'Cancelled' && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "10px" }}>
                    {b.is_used ? "ALREADY SCANNED" : "SCAN AT ENTRY"}
                  </span>
                )}
                
                {b.status !== 'Cancelled' && !b.is_used && (
                   <button 
                     onClick={() => handleCancel(b.id)} 
                     style={{
                       background: "transparent", 
                       border: "1px solid var(--veltech-red)", 
                       color: "var(--veltech-red)", 
                       padding: "5px 10px", 
                       fontSize: "0.8rem",
                       cursor: "pointer",
                       borderRadius: "4px"
                     }}
                   >
                     Cancel Booking
                   </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;