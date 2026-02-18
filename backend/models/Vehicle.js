const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  ownerName: String,
  phone: String
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
