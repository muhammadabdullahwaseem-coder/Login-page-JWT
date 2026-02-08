require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import Routes
const SignupRouter = require("./src/routes/signup");
const loginRouter = require("./src/routes/login");
const forgotPasswordRouter = require("./src/routes/forgotPassword");

const app = express();
const PORT = process.env.PORT || 5000;

// 👇 MIDDLEWARE (MUST BE AT THE TOP)
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json()); 

// 👇 ROUTES (MUST BE AFTER MIDDLEWARE)
app.use("/user", SignupRouter);          // Link: /user/register
app.use("/auth", loginRouter);           // Link: /auth/login
app.use("/auth", forgotPasswordRouter);  // Link: /auth/forgot-password

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.Mongo_db_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });