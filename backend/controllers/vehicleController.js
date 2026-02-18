const EmergencyVehicle = require("../models/EmergencyVehicle");

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await EmergencyVehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await EmergencyVehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
