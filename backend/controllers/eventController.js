const db = require("../config/db");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 });

// Get all events
exports.getEvents = (req, res) => {
  const cacheKey = "all_events";
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  db.query("SELECT * FROM events", (err, result) => {
    if (err) throw err;
    cache.set(cacheKey, result);
    res.json(result);
  });
};

// Get single event
exports.getEventById = (req, res) => {
  const id = req.params.id;
  const cacheKey = `event_${id}`;
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  db.query("SELECT * FROM events WHERE id = ?", [id], (err, result) => {
    if (result.length > 0) {
      cache.set(cacheKey, result[0]);
    }
    res.json(result[0]);
  });
};

// Create event (Admin)
exports.createEvent = (req, res) => {
  const { event_name, department, event_date, venue, price, available_tickets } = req.body;

  db.query(
    "INSERT INTO events (event_name, department, event_date, venue, price, available_tickets) VALUES (?, ?, ?, ?, ?, ?)",
    [event_name, department, event_date, venue, price, available_tickets],
    (err) => {
      if (err) throw err;
      cache.flushAll(); // Invalidate cache
      res.json({ message: "Event created successfully" });
    }
  );
};

// Update event
exports.updateEvent = (req, res) => {
  const id = req.params.id;
  const { event_name, department, event_date, venue, price, available_tickets } = req.body;

  db.query(
    "UPDATE events SET event_name=?, department=?, event_date=?, venue=?, price=?, available_tickets=? WHERE id=?",
    [event_name, department, event_date, venue, price, available_tickets, id],
    (err) => {
      if (err) throw err;
      cache.flushAll(); // Invalidate cache
      res.json({ message: "Event updated" });
    }
  );
};

// Delete event
exports.deleteEvent = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM events WHERE id = ?", [id], (err) => {
    if (err) throw err;
    cache.flushAll(); // Invalidate cache
    res.json({ message: "Event deleted" });
  });
};