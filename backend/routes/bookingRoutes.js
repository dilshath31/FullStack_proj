const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// Routes
router.post("/", bookingController.bookTicket);
router.post("/validate", bookingController.validateTicket);
router.delete("/:id", bookingController.cancelBooking);
router.get("/user/:user_id", bookingController.getUserBookings);
router.get("/", bookingController.getAllBookings);

module.exports = router;