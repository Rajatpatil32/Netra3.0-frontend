const Emergency = require("../models/Emergency");

exports.sendEmergency = async (req, res) => {
  try {
    const { vehicleId, message } = req.body;

    const emergency = await Emergency.create({
      vehicleId,
      message
    });

    res.status(201).json({
      message: "Emergency sent",
      emergency
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmergencyHistory = async (req, res) => {
  try {
    const history = await Emergency.find({
      vehicleId: req.params.vehicleId
    }).sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
