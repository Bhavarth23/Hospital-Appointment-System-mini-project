const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Debugging middleware to see incoming requests in the terminal
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Controllers
const { register, login, getUsers } = require("./controllers/authController");
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
} = require("./controllers/aptController");

// AUTH ROUTES - Updated to include /auth prefix to match your api.js
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/users", getUsers);

// APPOINTMENT ROUTES - Updated to include /appointments prefix to match your api.js
app.post("/api/appointments/book", bookAppointment);
app.get("/api/appointments", getAppointments);
app.delete("/api/appointments/cancel/:id", cancelAppointment);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully"))
  .catch((err) => console.log("DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
