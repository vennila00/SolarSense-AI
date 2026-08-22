const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authControllers");

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile Route (Protected)
router.get("/profile", protect, getProfile);

module.exports = router;