const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mabdullahwaseem999@gmail.com", 
    pass: "mefp ourt gfuh dywy"    
  }
});

// 1. Route to Request OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save to DB (expires in 10 mins)
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; 
    await user.save();

    // Send Email
    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending email" });
  }
});

// 2. Route to Verify OTP & Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } // Check if not expired
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.password = hashedPassword;
    user.otp = undefined; // Clear OTP
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
