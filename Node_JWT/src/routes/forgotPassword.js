const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  console.log("FORGOT PASSWORD ROUTE HIT - BREVO API");
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: "mabdullahwaseem999@gmail.com", name: "JWT_App" },
        to: [{ email: user.email }],
        subject: "Password Reset OTP",
        textContent: `Your OTP is: ${otp}`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("BREVO API ERROR:", errorData);
      return res.status(500).json({ message: "Error sending email via API" });
    }

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
  console.log("RESET PASSWORD REQUEST RECEIVED");
  
  try {
    console.log("Frontend Sent Data:", req.body);

    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
      console.log("ERROR: newPassword is EMPTY! Check Frontend variable names.");
      return res.status(400).json({ message: "New password is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Old Password Hash in DB:", user.password);

    if (user.resetPasswordOTP !== otp) {
        console.log("OTP Mismatch");
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New Password Hash Generated:", hashedPassword);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save(); 
    console.log("DATABASE UPDATED SUCCESSFULLY!");

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;