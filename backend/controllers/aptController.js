const Appointment = require("../models/Appointment");

// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get Appointments (With populated names)
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("patient", "name");
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
