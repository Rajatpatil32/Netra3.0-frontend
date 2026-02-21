const express = require("express");
const router = express.Router();

const {
  registerVehicle, getVehicleByQR
} = require("../controllers/vehicleController");

// GET vehicle details from QR
router.get("/:qrId", getVehicleByQR);

router.post("/register", registerVehicle);

module.exports = router;