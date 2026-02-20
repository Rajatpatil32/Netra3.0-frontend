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