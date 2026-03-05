const express = require("express");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const cleanOtp = (otp) => String(otp || "").trim();
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createTransporter = () => {
  const emailUser = String(process.env.EMAIL_USER || "").trim();
  const emailPass = String(process.env.EMAIL_PASS || "").trim();

  if (!emailUser || !emailPass) {
    const err = new Error("Server email config missing (EMAIL_USER / EMAIL_PASS).");
    err.code = "EMAIL_CONFIG_MISSING";
    throw err;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: emailUser, pass: emailPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

router.post("/forgot-password", async (req, res) => {
  console.log("FORGOT PASSWORD ROUTE HIT - FINAL");

  try {
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const transporter = createTransporter();
    await transporter.verify();
    console.log("SMTP verified");

    const otp = generateOtp();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const emailUser = String(process.env.EMAIL_USER || "").trim();
    await transporter.sendMail({
      from: emailUser,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}\nThis code expires in 15 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("FORGOT-PASSWORD ERROR:", error?.code || "", error?.message || error);

    return res.status(500).json({
      message: "Server error while sending email",
      ...(process.env.NODE_ENV !== "production" && {
        debug: { code: error?.code, message: error?.message },
      }),
    });
  }
});

router.post("/reset-password", async (req, res) => {
  console.log("RESET PASSWORD ROUTE HIT - FINAL");

  try {
    const email = normalizeEmail(req.body.email);
    const otp = cleanOtp(req.body.otp);
    const newPassword = String(req.body.newPassword || "");

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    const expiresAt = new Date(user.resetPasswordExpires).getTime();
    if (expiresAt < Date.now()) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save().catch(() => {});
      return res.status(400).json({ message: "OTP expired" });
    }

    if (cleanOtp(user.resetPasswordOTP) !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET-PASSWORD ERROR:", error?.code || "", error?.message || error);

    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        debug: { code: error?.code, message: error?.message },
      }),
    });
  }
});

module.exports = router;
