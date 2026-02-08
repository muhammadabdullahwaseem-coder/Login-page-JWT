const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User"); 
const jwt = require("jsonwebtoken");

const router = express.Router();

// 👇 DEBUG LOG: This will print when you start the server
console.log("✅ Login Route File is Loaded!");

// 👇 The route is '/login'. Combined with app.js, it becomes '/auth/login'
router.post("/login", async (req, res) => {
  console.log("📩 Login Request Received!"); // 👇 Prints when you click 'Login' button

  try {
    const { email, password } = req.body;
    
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ User not found");
        return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("❌ Wrong password");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
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