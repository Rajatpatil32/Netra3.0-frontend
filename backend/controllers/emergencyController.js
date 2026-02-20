

const Emergency = require("../models/Emergency");
const Vehicle = require("../models/Vehicle");

exports.createEmergency = async (req, res) => {
  try {

    const { qrId, visitorPhone, message, photo } = req.body;

    // check vehicle
    const vehicle = await Vehicle.findOne({ qrId });

    if (!vehicle)
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });

    // save emergency
    const emergency = await Emergency.create({
      vehicleId: vehicle._id,
      visitorPhone,
      message,
      photo
    });

    // simulate notification
    console.log(`
    ======================
    EMERGENCY ALERT
    Vehicle: ${vehicle.vehicleNumber}
    Owner Phone: ${vehicle.ownerPhone}
    Visitor Phone: ${visitorPhone}
    Message: ${message}
    ======================
    `);

    res.json({
      success: true,
      message: "Emergency alert sent successfully",
      data: emergency
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};