const Vehicle = require("../models/Vehicle");


// Fetch vehicle details by QR ID
exports.getVehicleByQR = async (req, res) => {

  try {

    const { qrId } = req.params;

    const vehicle = await Vehicle.findOne({ qrId });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.json({
      success: true,
      data: {
        qrId: vehicle.qrId,
        vehicleNumber: vehicle.vehicleNumber,
        ownerName: vehicle.ownerName,
        ownerPhone: vehicle.ownerPhone,
        vehicleType: vehicle.vehicleType
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

exports.registerVehicle = async (req, res) => {

  try {

    const {
      qrId,
      vehicleNumber,
      ownerName,
      ownerPhone,
      ownerEmail
    } = req.body;

    // Check if QR already registered
    const existingQR = await Vehicle.findOne({ qrId });

    if (existingQR) {

      return res.status(400).json({
        success: false,
        message: "This QR is already registered",
        data: 1
      });

    }

    // Check vehicle number exists
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber
    });

    if (existingVehicle) {

      return res.status(400).json({
        success: false,
        message: "Vehicle already registered"
      });

    }

    // Create vehicle
    const vehicle = await Vehicle.create({

      qrId,
      vehicleNumber: vehicleNumber.toUpperCase(),
      ownerName,
      ownerPhone,
      ownerEmail

    });

    res.json({

      success: true,
      message: "Vehicle registered successfully",
      data: vehicle

    });

  }
  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};