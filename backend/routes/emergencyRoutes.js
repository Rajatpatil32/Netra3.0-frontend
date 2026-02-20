const express = require("express");
const router = express.Router();

const {
  createEmergency
} = require("../controllers/emergencyController");

router.post("/", createEmergency);

module.exports = router;