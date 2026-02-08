const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User"); 
const jwt = require("jsonwebtoken");

const router = express.Router();

console.log("✅ Login Route File is Loaded!");

router.post("/login", async (req, res) => {
  console.log("📩 Login Request Received!");

  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ User not found");
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("❌ Wrong password");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key", {
      expiresIn: "1h",
    });

    console.log("✅ Login Successful for:", email);
    res.status(200).json({ token, user, message: "Login successful" });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;