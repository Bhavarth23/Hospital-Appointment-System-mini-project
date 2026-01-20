const express = require("express");
const router = express.Router();
const { register, login, getUsers } = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register Patient or Doctor
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", login);

// @route   GET /api/auth/users
// @desc    Get all registered users
router.get("/users", getUsers);

module.exports = router;
