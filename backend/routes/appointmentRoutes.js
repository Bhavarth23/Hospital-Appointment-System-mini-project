const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
} = require("../controllers/aptController");

// @route   POST /api/appointments/book
// @desc    Create a new appointment
router.post("/book", bookAppointment);

// @route   GET /api/appointments
// @desc    Fetch all booked appointments
router.get("/", getAppointments);

// @route   DELETE /api/appointments/cancel/:id
// @desc    Cancel/Delete an appointment
router.delete("/cancel/:id", cancelAppointment);

module.exports = router;
