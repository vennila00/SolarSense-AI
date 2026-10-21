const express = require("express");
const router = express.Router();

const {
  calculateSolar,
  getCalculationHistory,
  deleteCalculation
} = require("../controllers/solarControllers");

const protect = require("../middleware/authMiddleware");

// Create Calculation (Removed protect middleware for testing)
router.post("/calculate", calculateSolar);

// Get History
router.get("/history", protect, getCalculationHistory);

// Delete Calculation
router.delete("/:id", protect, deleteCalculation);

module.exports = router;