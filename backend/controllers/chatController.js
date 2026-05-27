const db = require("../config/db");

exports.handleChat = (req, res) => {
  const { message, userId } = req.body;
  if (!message) return res.status(400).json({ reply: "Please say something!" });

  const msg = message.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi")) {
    return res.json({ reply: "Hello! How can I help you today? I can help you find events, show your tickets, or cancel a booking." });
  }

  if (msg.includes("event") || msg.includes("available")) {
    db.query("SELECT event_name, available_tickets FROM events WHERE available_tickets > 0 LIMIT 3", (err, results) => {
      if (err) return res.json({ reply: "Sorry, I'm having trouble fetching events right now." });
      if (results.length === 0) return res.json({ reply: "There are no available events at the moment." });
      
      const eventList = results.map(e => `${e.event_name} (${e.available_tickets} tickets left)`).join(", ");
      return res.json({ reply: `Here are some available events: ${eventList}. You can book them from the home page!` });
    });
    return;
  }

  if (msg.includes("ticket") || msg.includes("booking") || msg.includes("show my")) {
    if (!userId) return res.json({ reply: "Please log in first so I can fetch your tickets." });
    
    db.query("SELECT event_name, tickets, status FROM bookings JOIN events ON bookings.event_id = events.id WHERE user_id = ? AND status = 'Booked' LIMIT 3", [userId], (err, results) => {
      if (err) return res.json({ reply: "Sorry, I couldn't fetch your tickets." });
      if (results.length === 0) return res.json({ reply: "You don't have any active bookings." });
      
      const ticketList = results.map(b => `${b.event_name} (${b.tickets} tickets)`).join(", ");
      return res.json({ reply: `Here are your recent active bookings: ${ticketList}. Check 'My Bookings' page for details and QR codes.` });
    });
    return;
  }

  if (msg.includes("cancel")) {
    return res.json({ reply: "To cancel a booking, please go to the 'My Bookings' page, locate the ticket, and click the 'Cancel Booking' button below your QR code." });
  }

  return res.json({ reply: "I'm a simple bot. Try asking me about 'events', 'my tickets', or 'how to cancel'." });
};
