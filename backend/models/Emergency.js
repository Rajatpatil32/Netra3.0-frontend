const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
{
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  visitorPhone: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  photo: {
    type: String, // base64 or URL
    required: true
  },

  status: {
    type: String,
    default: "sent"
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Emergency", emergencySchema);

