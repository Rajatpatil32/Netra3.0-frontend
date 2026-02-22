const express = require("express");
const router = express.Router();

const {
  registerVehicle, getVehicleByQR, sendRegisterOTP
} = require("../controllers/vehicleController");

// GET vehicle details from QR
router.get("/:qrId", getVehicleByQR);

router.post("/send-otp", sendRegisterOTP);
router.post("/register", registerVehicle);

module.exports = router;