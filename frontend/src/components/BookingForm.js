import { useState } from "react";
import { bookTicket } from "../services/api";

function BookingForm({ event, refreshEvents }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    department: "",
    tickets: ""
  });
  
  const [error, setError] = useState("");
  const [bookingSummary, setBookingSummary] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    setError("");
    
    if (!formData.name || !formData.email || !formData.department || !formData.tickets) {
      setError("All fields are mandatory.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }
    
    const ticketCount = Number(formData.tickets);
    if (isNaN(ticketCount) || ticketCount <= 0) {
      setError("Number of tickets must be a positive number.");
      return;
    }

    if (ticketCount > event.available_tickets) {
      setError("Not enough tickets available.");
      return;
    }

    try {
      const res = await bookTicket({
        user_id: user ? user.id : null,
        event_id: event.id,
        tickets: ticketCount,
        name: formData.name,
        email: formData.email,
        department: formData.department
      });

      setBookingSummary({
        name: formData.name,
        eventName: res.data.eventName || event.event_name,
        tickets: ticketCount,
        total: res.data.total,
        date: new Date(event.event_date).toLocaleDateString(),
        venue: event.venue,
        qr_code: res.data.qr_code,
        ticket_id: res.data.ticket_id
      });

      setFormData({ ...formData, tickets: "" });
      refreshEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const resetForm = () => {
    setBookingSummary(null);
    setFormData({
      name: user ? user.name : "",
      email: user ? user.email : "",
      department: "",
      tickets: ""
    });
    setError("");
  };

  if (bookingSummary) {
    return (
      <div className="boarding-pass">
        <div className="boarding-pass-header">
          <span>EVENT TICKET</span>
          <span>✅ CONFIRMED</span>
        </div>
        
        <div className="boarding-pass-body">
          <div className="pass-row">
            <div className="pass-col">
              <label>Passenger Name</label>
              <span>{bookingSummary.name}</span>
            </div>
            <div className="pass-col" style={{ textAlign: "right" }}>
              <label>Seats</label>
              <span>{bookingSummary.tickets}x</span>
            </div>
          </div>
          
          <div className="pass-row">
            <div className="pass-col">
              <label>Event Name</label>
              <span>{bookingSummary.eventName}</span>
            </div>
          </div>

          <div className="pass-row">
            <div className="pass-col">
              <label>Date</label>
              <span>{bookingSummary.date}</span>
            </div>
            <div className="pass-col" style={{ textAlign: "right" }}>
              <label>Venue</label>
              <span>{bookingSummary.venue}</span>
            </div>
          </div>
        </div>

        <div className="boarding-pass-separator"></div>

        <div className="boarding-pass-footer" style={{flexDirection: "column", alignItems: "center", paddingBottom: "15px"}}>
          {bookingSummary.qr_code ? (
            <img src={bookingSummary.qr_code} alt="Ticket QR Code" style={{ width: "120px", height: "120px", marginBottom: "10px" }} />
          ) : (
            <div className="barcode-stub" style={{marginBottom: "10px"}}></div>
          )}
          {bookingSummary.ticket_id && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "5px" }}>
              TICKET ID: {bookingSummary.ticket_id.split('-')[0].toUpperCase()}
            </span>
          )}
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Paid: <strong>₹{bookingSummary.total}</strong></span>
          <button onClick={resetForm} className="btn-secondary" style={{ marginTop: "10px" }}>Book Another Ticket</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form" style={{ marginTop: "10px" }}>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
      <input
        type="number"
        name="tickets"
        placeholder="No. of tickets"
        value={formData.tickets}
        onChange={handleChange}
      />
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}

export default BookingForm;