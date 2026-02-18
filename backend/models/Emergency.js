const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Emergency", emergencySchema);
