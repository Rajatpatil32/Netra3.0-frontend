const Ring = require("../models/Ring");

exports.sendRing = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ message: "Vehicle ID required" });
    }

    const ring = await Ring.create({ vehicleId });

    const io = req.app.get("io");
    io.to(vehicleId).emit("newRing", ring);

    res.status(201).json({
      message: "Ring sent successfully",
      ring
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRings = async (req, res) => {
  try {
    const rings = await Ring.find({
      vehicleId: req.params.vehicleId
    }).sort({ timestamp: -1 });

    res.json(rings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
