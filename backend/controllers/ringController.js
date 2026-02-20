const Ring = require("../models/Ring");
const Vehicle = require("../models/Vehicle");


// POST /api/ring
exports.createRingRequest = async (req, res) => {

  try {

    const { qrId, visitorPhone, message } = req.body;

    if (!qrId || !visitorPhone) {
      return res.status(400).json({
        success: false,
        message: "qrId and visitorPhone required"
      });
    }

    // find vehicle
    const vehicle = await Vehicle.findOne({ qrId });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    // save ring request
    const ring = await Ring.create({
      qrId,
      vehicleNumber: vehicle.vehicleNumber,
      ownerPhone: vehicle.ownerPhone,
      visitorPhone,
      status: "pending",
      message: message || "Someone is trying to contact you"
    });


    // 🔔 Here later we send WhatsApp / Push / Socket notification


    console.log(`
NEW RING REQUEST
Vehicle: ${vehicle.vehicleNumber}
Owner: ${vehicle.ownerPhone}
Visitor: ${visitorPhone}
Message: ${message}
    `);


    res.json({
      success: true,
      message: "Owner notified successfully",
      data: {
        ringId: ring._id,
        ownerName: vehicle.ownerName
      }
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};