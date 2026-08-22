const express = require("express");
const router = express.Router();

const { getScheme } = require("../controllers/schemeControllers");

// Get Scheme by State
router.get("/:state", getScheme);

module.exports = router;
