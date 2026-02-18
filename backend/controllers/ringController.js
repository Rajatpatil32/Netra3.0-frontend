const { v4: uuidv4 } = require("uuid");
const RingEvent = require("../models/RingEvent");
const RingStatusHistory = require("../models/RingStatusHistory");

exports.createRing = async (req, res) => {
  try {
    const { phoneNumber, location } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number required" });
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const ring = await RingEvent.create({
      ringId: uuidv4(),
      phoneNumber,
      location
    });

    res.status(201).json(ring);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRings = async (req, res) => {
  try {
    const rings = await RingEvent.find()
      .populate("assignedVehicle")
      .sort({ createdAt: -1 });

    res.json(rings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ring = await RingEvent.findById(id);

    if (!ring) {
      return res.status(404).json({ message: "Ring not found" });
    }

    const oldStatus = ring.status;

    ring.status = status;

    if (status === "resolved") {
      ring.resolvedAt = new Date();
    }

    await ring.save();

    await RingStatusHistory.create({
      ring: ring._id,
      oldStatus,
      newStatus: status
    });

    res.json(ring);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
