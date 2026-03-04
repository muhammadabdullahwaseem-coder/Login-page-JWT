const express = require("express");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  console.log("FORGOT PASSWORD ROUTE HIT - VERSION 3");
  try {
    const { email } = req.body;
    const emailUser = (process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

    console.log("EMAIL_USER exists?", !!emailUser);
    console.log("EMAIL_PASS exists?", !!emailPass);

    if (!emailUser || !emailPass) {
      console.error("EMAIL CONFIG ERROR: EMAIL_USER/EMAIL_PASS missing on server env");
      return res.status(500).json({
        message: "Server email config missing (EMAIL_USER / EMAIL_PASS).",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.verify();
    console.log("SMTP verified");

    await transporter.sendMail({
      from: emailUser,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("FORGOT-PASSWORD ERROR:", error);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR STACK:", error?.stack);
    return res.status(500).json({ message: error?.message || "Error sending email" });
  }
  
});

router.post("/reset-password", async (req, res) => {
  console.log("---------------------------------------");
  console.log("🕵️‍♂️ RESET PASSWORD REQUEST RECEIVED");
  
  try {
    console.log("📦 Frontend Sent Data:", req.body);

    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
      console.log("❌ ERROR: newPassword is EMPTY! Check Frontend variable names.");
      return res.status(400).json({ message: "New password is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("🔑 Old Password Hash in DB:", user.password);

    if (user.resetPasswordOTP !== otp) {
        console.log("❌ OTP Mismatch");
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 New Password Hash Generated:", hashedPassword);

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
