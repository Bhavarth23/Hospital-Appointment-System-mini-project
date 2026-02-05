const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body; // Ensure specialization is here
    const normalizedRole =
      typeof role === "string" && role.trim() !== ""
        ? role.trim().toLowerCase()
        : "patient";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : email;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      specialization:
        normalizedRole === "doctor" ? specialization : undefined, // Logic to handle doctor field
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    // This helps the frontend see the actual error instead of "undefined"
    res.status(400).json({ success: false, error: err.message });
  }
};

// Authenticate User (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : email;
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .status(200)
      .json({ success: true, token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Users (To view available Doctors/Patients)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
