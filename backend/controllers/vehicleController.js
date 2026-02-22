const Vehicle = require("../models/Vehicle");


// Fetch vehicle details by QR ID
exports.getVehicleByQR = async (req, res) => {

  try {

    const { qrId } = req.params;

    const vehicle = await Vehicle.findOne({ qrId });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.json({
      success: true,
      data: {
        qrId: vehicle.qrId,
        vehicleNumber: vehicle.vehicleNumber,
        ownerName: vehicle.ownerName,
        ownerPhone: vehicle.ownerPhone,
        vehicleType: vehicle.vehicleType
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

const { saveOTP } = require("../utils/otpStore");
const { sendOTP } = require("../utils/sendMail");

exports.sendRegisterOTP = async (req, res) => {
  try {
    const { vehicleNumber, ownerEmail, qrId } = req.body;

    if (!ownerEmail)
      return res.status(400).json({ message: "Email required" });

    // 🚨 CHECK VEHICLE EXISTS FIRST
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle)
      return res.status(400).json({ message: "Vehicle already registered" });

    const existingQR = await Vehicle.findOne({ qrId });
    if (existingQR)
      return res.status(400).json({ message: "QR already registered" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOTP(ownerEmail, otp);
    saveOTP(ownerEmail, otp);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const { verifyOTP, deleteOTP } = require("../utils/otpStore");

exports.registerVehicle = async (req, res) => {
  try {
    const {
      qrId,
      vehicleNumber,
      ownerName,
      ownerPhone,
      ownerEmail,
      otp
    } = req.body;

    const email = ownerEmail.trim().toLowerCase();

    // OTP CHECK
    if (!verifyOTP(email, String(otp))) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // delete after success
    deleteOTP(email);

    const existingQR = await Vehicle.findOne({ qrId });
    if (existingQR)
      return res.status(400).json({ message: "QR already registered" });

    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle)
      return res.status(400).json({ message: "Vehicle already registered" });

    const vehicle = await Vehicle.create({
      qrId,
      vehicleNumber,
      ownerName,
      ownerPhone,
      ownerEmail: email
    });

    res.json({
      success: true,
      message: "Vehicle registered successfully",
      data: vehicle
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.registerVehicle = async (req, res) => {

//   try {

//     const {
//       qrId,
//       vehicleNumber,
//       ownerName,
//       ownerPhone,
//       ownerEmail
//     } = req.body;

//     // Check if QR already registered
//     const existingQR = await Vehicle.findOne({ qrId });

//     if (existingQR) {

//       return res.status(400).json({
//         success: false,
//         message: "This QR is already registered",
//         data: 1
//       });

//     }

//     // Check vehicle number exists
//     const existingVehicle = await Vehicle.findOne({
//       vehicleNumber
//     });

//     if (existingVehicle) {

//       return res.status(400).json({
//         success: false,
//         message: "Vehicle already registered"
//       });

//     }

//     // Create vehicle
//     const vehicle = await Vehicle.create({

//       qrId,
//       vehicleNumber: vehicleNumber.toUpperCase(),
//       ownerName,
//       ownerPhone,
//       ownerEmail

//     });

//     res.json({

//       success: true,
//       message: "Vehicle registered successfully",
//       data: vehicle

//     });

//   }
//   catch (err) {

//     res.status(500).json({

//       success: false,
//       message: err.message

//     });

//   }

// };