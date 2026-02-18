const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({

  ring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RingEvent",
    required: true
  },

  oldStatus: String,
  newStatus: String,

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("RingStatusHistory", historySchema);
