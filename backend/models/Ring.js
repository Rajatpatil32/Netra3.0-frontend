const mongoose = require("mongoose");

const ringSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responded: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Ring", ringSchema);
