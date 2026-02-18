const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({

  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ["ambulance", "police", "fire"],
    required: true
  },

  currentLocation: {
    latitude: Number,
    longitude: Number
  },

  status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "available"
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("EmergencyVehicle", vehicleSchema);
