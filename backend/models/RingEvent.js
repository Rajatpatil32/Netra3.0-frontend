const mongoose = require("mongoose");

const ringEventSchema = new mongoose.Schema({

  ringId: {
    type: String,
    unique: true
  },

  phoneNumber: {
    type: String,
    required: true
  },

  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },

  status: {
    type: String,
    enum: ["active", "acknowledged", "vehicle_assigned", "resolved"],
    default: "active"
  },

  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyVehicle"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: Date

});

module.exports = mongoose.model("RingEvent", ringEventSchema);
