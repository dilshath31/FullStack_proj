const db = require("../config/db");

// Admin Login
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    (err, result) => {
      if (result.length === 0) {
        return res.status(400).json({ message: "Admin not found" });
      }

      if (password !== result[0].password) {
        return res.status(400).json({ message: "Wrong password" });
      }

      res.json({
        message: "Admin login successful",
        admin: result[0]
      });
    }
  );
};


// Create Admin
exports.createAdmin = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO admins (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Admin already exists" });
      }
      res.json({ message: "Admin created successfully" });
    }
  );
};