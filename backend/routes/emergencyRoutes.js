const express = require("express");
const router = express.Router();
const {
  sendEmergency,
  getEmergencyHistory
} = require("../controllers/emergencyController");

router.post("/", sendEmergency);
router.get("/:vehicleId", getEmergencyHistory);

module.exports = router;
