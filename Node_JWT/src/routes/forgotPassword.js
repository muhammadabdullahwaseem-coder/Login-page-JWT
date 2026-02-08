const express = require("express");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route A: Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email" });
  }
});

// 👇 DETECTIVE MODE: Reset Password
router.post("/reset-password", async (req, res) => {
  console.log("---------------------------------------");
  console.log("🕵️‍♂️ RESET PASSWORD REQUEST RECEIVED");
  
  try {
    // 1. Log exactly what the Frontend sent
    console.log("📦 Frontend Sent Data:", req.body);

    const { email, otp, newPassword } = req.body;

    // 2. Check if variables are empty
    if (!newPassword) {
      console.log("❌ ERROR: newPassword is EMPTY! Check Frontend variable names.");
      return res.status(400).json({ message: "New password is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Log Old Hash
    console.log("🔑 Old Password Hash in DB:", user.password);

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
        console.log("❌ OTP Mismatch");
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // 4. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 New Password Hash Generated:", hashedPassword);

    // 5. Update and Save
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save(); 
    console.log("✅ DATABASE UPDATED SUCCESSFULLY!");

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;