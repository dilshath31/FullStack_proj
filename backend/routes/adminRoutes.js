const express = require("express");
const router = express.Router();

// IMPORTANT FIX 👇
const { adminLogin, createAdmin } = require("../controllers/adminController");

router.post("/login", adminLogin);
router.post("/create", createAdmin);

module.exports = router;