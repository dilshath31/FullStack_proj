const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const sendEmail = require("../utils/email");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

// ✅ BOOK TICKET
exports.bookTicket = (req, res) => {
  const { user_id, event_id, tickets, name, email, department } = req.body;

  if (!name || !email || !department || !tickets || tickets <= 0) {
    return res.status(400).json({ message: "All fields are mandatory and tickets must be positive." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Get event details
  db.query(
    "SELECT * FROM events WHERE id = ?",
    [event_id],
    (err, eventResult) => {
      if (err) return res.status(500).json(err);
      if (eventResult.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      const event = eventResult[0];

      if (tickets > event.available_tickets) {
        return res.status(400).json({ message: "Not enough tickets available." });
      }

      const total = tickets * event.price;
      const ticket_id = uuidv4();

      QRCode.toDataURL(ticket_id, (qrErr, qr_code) => {
        if (qrErr) return res.status(500).json({ message: "QR Code generation failed" });

        // Insert booking
        db.query(
          "INSERT INTO bookings (user_id, event_id, tickets, total_amount, name, email, department, ticket_id, qr_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booked')",
          [user_id, event_id, tickets, total, name, email, department, ticket_id, qr_code],
          (err) => {
            if (err) return res.status(500).json(err);

            // Update tickets
            db.query(
              "UPDATE events SET available_tickets = available_tickets - ? WHERE id = ?",
              [tickets, event_id],
              async (updateErr) => {
                if (updateErr) return res.status(500).json(updateErr);
                
                cache.flushAll(); // Clear cache

                const qrCodeData = qr_code.split("base64,")[1];
                const attachments = [{
                  filename: 'qrcode.png',
                  content: qrCodeData,
                  encoding: 'base64',
                  cid: 'qrcode-image'
                }];

                const emailBody = `
                  <h2>Booking Confirmed!</h2>
                  <p>Hi ${name},</p>
                  <p>Your booking for <b>${event.event_name}</b> has been confirmed.</p>
                  <p>Tickets: ${tickets}</p>
                  <p>Total Paid: ₹${total}</p>
                  <p>Please present the QR Code below at the event entrance:</p>
                  <img src="cid:qrcode-image" alt="Ticket QR Code" />
                `;
                await sendEmail(email, "Booking Confirmation - Ticket Booking System", emailBody, attachments);

                res.json({ 
                  message: "Booking successful", 
                  total, 
                  bookedTickets: tickets, 
                  eventName: event.event_name,
                  qr_code,
                  ticket_id
                });
              }
            );
          }
        );
      });
    }
  );
};

// ✅ CANCEL BOOKING
exports.cancelBooking = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM bookings WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Booking not found" });

    const booking = results[0];

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    db.query("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", [id], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error" });

      db.query("UPDATE events SET available_tickets = available_tickets + ? WHERE id = ?", [booking.tickets, booking.event_id]);
      
      cache.flushAll(); // Clear cache
      sendEmail(booking.email, "Booking Cancelled", `<p>Your booking for ticket ID ${booking.ticket_id} has been cancelled.</p>`);

      res.json({ message: "Booking cancelled successfully" });
    });
  });
};

// ✅ VALIDATE TICKET
exports.validateTicket = (req, res) => {
  const { ticket_id } = req.body;

  if (!ticket_id) return res.status(400).json({ message: "Ticket ID required" });

  db.query("SELECT * FROM bookings WHERE ticket_id LIKE ?", [`${ticket_id}%`], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Invalid Ticket ID" });
    if (results.length > 1) return res.status(400).json({ message: "Multiple tickets found for this partial ID. Please be more specific." });

    const booking = results[0];

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: "Ticket is cancelled" });
    }

    if (booking.is_used) {
      return res.status(400).json({ message: "Ticket has already been used" });
    }

    db.query("UPDATE bookings SET is_used = 1 WHERE id = ?", [booking.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Ticket validated successfully! Access Granted." });
    });
  });
};

// ✅ USER BOOKINGS
exports.getUserBookings = (req, res) => {
  const { user_id } = req.params;
  const cacheKey = `user_bookings_${user_id}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  db.query(
    `
    SELECT bookings.*, events.event_name 
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    WHERE user_id = ?
    `,
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      cache.set(cacheKey, result);
      res.json(result);
    }
  );
};

// ✅ ALL BOOKINGS (ADMIN)
exports.getAllBookings = (req, res) => {
  const cacheKey = 'all_bookings';

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  db.query(
    `
    SELECT bookings.*, users.name, users.email, events.event_name 
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    JOIN events ON bookings.event_id = events.id
    `,
    (err, result) => {
      if (err) return res.status(500).json(err);
      cache.set(cacheKey, result);
      res.json(result);
    }
  );
};