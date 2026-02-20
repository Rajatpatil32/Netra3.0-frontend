const express = require("express");
const router = express.Router();

const {
  getVehicleByQR
} = require("../controllers/vehicleController");


// GET vehicle details from QR
router.get("/:qrId", getVehicleByQR);


module.exports = router;