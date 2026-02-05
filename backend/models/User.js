const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // Doesn't return password in queries by default
  },
  role: {
    type: String,
    enum: ["doctor", "patient"],
    default: "patient",
  },
  specialization: {
    type: String, // Only relevant if role is 'doctor'
    required: function () {
      return this.role === "doctor";
    },
  },
  availability: {
    weeklyHours: {
      type: [
        {
          day: String,
          start: String,
          end: String,
          enabled: Boolean,
        },
      ],
      default: [
        { day: "Mon", start: "09:00", end: "17:00", enabled: true },
        { day: "Tue", start: "09:00", end: "17:00", enabled: true },
        { day: "Wed", start: "09:00", end: "17:00", enabled: true },
        { day: "Thu", start: "09:00", end: "17:00", enabled: true },
        { day: "Fri", start: "09:00", end: "17:00", enabled: true },
        { day: "Sat", start: "09:00", end: "13:00", enabled: false },
        { day: "Sun", start: "09:00", end: "13:00", enabled: false },
      ],
    },
    blockedDates: {
      type: [Date],
      default: [],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
