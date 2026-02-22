require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Netra Verification" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes.</p>`
  });
};