const express = require("express");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const router = express.Router();


function createTransporter() {
  const emailUser = String(process.env.EMAIL_USER || "").trim();
  const emailPass = String(process.env.EMAIL_PASS || "").trim();

  if (!emailUser || !emailPass) {
    const err = new Error("EMAIL_USER/EMAIL_PASS missing");
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
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function genericOkMessage() {
 
  return { message: "If the email exists, OTP has been sent." };
}


const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

const emailHits = new Map();
const ipHits = new Map();   

function hit(map, key, max, windowMs) {
  const now = Date.now();
  const item = map.get(key);

  if (!item || item.resetAt < now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (item.count >= max) {
    return { allowed: false, retryAfterMs: item.resetAt - now };
  }

  item.count += 1;
  return { allowed: true };
}


router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;

    if (!email) return res.status(400).json({ message: "Email is required" });


    const ipCheck = hit(ipHits, ip, MAX_PER_IP, RATE_WINDOW_MS);
    if (!ipCheck.allowed) {
      return res.status(429).json({ message: "Too many requests. Try again later." });
    }

    const emailCheck = hit(emailHits, email, MAX_PER_EMAIL, RATE_WINDOW_MS);
    if (!emailCheck.allowed) {
      return res.status(429).json({ message: "Too many requests. Try again later." });
    }

    const transporter = createTransporter();


    await transporter.verify();

    const user = await User.findOne({ email });

   
    if (!user) {
      return res.status(200).json(genericOkMessage());
    }

    
    const otp = generateOtp();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const emailUser = String(process.env.EMAIL_USER || "").trim();

    try {
      await transporter.sendMail({
        from: emailUser,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}\nThis code expires in 15 minutes.`,
      });
    } catch (mailErr) {
     
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save().catch(() => {});
      throw mailErr;
    }

    return res.status(200).json(genericOkMessage());
  } catch (error) {
    
    console.error("FORGOT-PASSWORD ERROR:", error?.code || "", error?.message || error);
    return res.status(500).json({ message: "Error sending email" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
   
    if (!user) return res.status(400).json({ message: "Invalid OTP or expired" });

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    if (user.resetPasswordExpires < Date.now()) {
    
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save().catch(() => {});
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    if (String(user.resetPasswordOTP).trim() !== otp) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

  
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET-PASSWORD ERROR:", error?.code || "", error?.message || error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;