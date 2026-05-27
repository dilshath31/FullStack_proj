const db = require("../config/db");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Expires in 5 minutes
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      const user = results[0];
      if (user.is_verified) {
        return res.status(400).json({ message: "User already registered and verified" });
      } else {
        // User exists but not verified, update their OTP and password
        db.query(
          "UPDATE users SET name=?, password=?, otp=?, otp_expires=? WHERE email=?",
          [name, hashedPassword, otp, otpExpires, email],
          async (updateErr) => {
            if (updateErr) return res.status(500).json({ message: "Database error" });
            
            console.log(`\n=========================================\n🎟️  OTP FOR ${email} IS: ${otp} \n=========================================\n`);

            await sendEmail(email, "Your OTP Code", `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`);
            return res.json({ message: "OTP sent to email. Please verify." });
          }
        );
      }
    } else {
      // New user
      db.query(
        "INSERT INTO users (name, email, password, otp, otp_expires, is_verified) VALUES (?, ?, ?, ?, ?, 0)",
        [name, email, hashedPassword, otp, otpExpires],
        async (insertErr) => {
          if (insertErr) return res.status(500).json({ message: "Database error" });
          
          console.log(`\n=========================================\n🎟️  OTP FOR ${email} IS: ${otp} \n=========================================\n`);

          await sendEmail(email, "Your OTP Code", `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`);
          res.json({ message: "User registered successfully. OTP sent to email." });
        }
      );
    }
  });
};

// Verify OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark as verified and clear OTP
    db.query("UPDATE users SET is_verified = 1, otp = NULL, otp_expires = NULL WHERE email = ?", [email], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Account verified successfully. You can now log in." });
    });
  });
};

// Login User
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];

      if (!user.is_verified) {
         return res.status(403).json({ message: "Please verify your email before logging in", unverified: true });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }
  );
};