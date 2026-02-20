const mongoose = require("mongoose");

const ringSchema = new mongoose.Schema(
{
  qrId: {
    type: String,
    required: true,
    index: true
  },

  vehicleNumber: {
    type: String,
    required: true
  },

  ownerPhone: {
    type: String,
    required: true
  },

  visitorPhone: {
    type: String,
    required: true
  },

   message: {
    type: String,
    default: "Someone is trying to contact you."
  },

  status: {
    type: String,
    enum: ["pending", "notified", "responded"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Ring", ringSchema);