const User = require("../models/User");

// Get Doctor Availability
exports.getAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("availability role");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "doctor") {
      return res
        .status(400)
        .json({ success: false, error: "User is not a doctor" });
    }
    res.status(200).json({ success: true, data: user.availability });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update Doctor Availability
exports.updateAvailability = async (req, res) => {
  try {
    const { weeklyHours, blockedDates } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "doctor") {
      return res
        .status(400)
        .json({ success: false, error: "User is not a doctor" });
    }

    user.availability = {
      weeklyHours: Array.isArray(weeklyHours)
        ? weeklyHours
        : user.availability.weeklyHours,
      blockedDates: Array.isArray(blockedDates)
        ? blockedDates
        : user.availability.blockedDates,
    };

    await user.save();

    res.status(200).json({ success: true, data: user.availability });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
