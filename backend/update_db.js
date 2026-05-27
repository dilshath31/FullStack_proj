const db = require("./config/db");

const alterUsers = `
  ALTER TABLE users 
  ADD COLUMN otp VARCHAR(6) NULL,
  ADD COLUMN otp_expires DATETIME NULL,
  ADD COLUMN is_verified BOOLEAN DEFAULT 0;
`;

const alterBookings = `
  ALTER TABLE bookings 
  ADD COLUMN ticket_id VARCHAR(36) UNIQUE NULL,
  ADD COLUMN qr_code TEXT NULL,
  ADD COLUMN is_used BOOLEAN DEFAULT 0,
  ADD COLUMN status VARCHAR(20) DEFAULT 'Booked';
`;

db.query(alterUsers, (err) => {
  if (err) {
    console.error("Error altering users table:", err);
    if (err.code !== 'ER_DUP_FIELDNAME') {
       // Ignore duplicate field names
    }
  } else {
    console.log("Users table updated successfully.");
  }

  db.query(alterBookings, (err2) => {
    if (err2) {
      console.error("Error altering bookings table:", err2);
    } else {
      console.log("Bookings table updated successfully.");
    }
    process.exit();
  });
});
