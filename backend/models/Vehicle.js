const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
  qrId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  vehicleNumber: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },

  ownerName: {
    type: String,
    required: true
  },

  ownerPhone: {
    type: String,
    required: true
  },

  ownerEmail: {
    type: String,
    default: null
  },

  vehicleType: {
    type: String,
    enum: ["car", "bike", "truck", "other"],
    default: "car"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);