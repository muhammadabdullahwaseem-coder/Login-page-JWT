require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const SignupRouter = require("./src/routes/signup");
const loginRouter = require("./src/routes/login");
const forgotPasswordRouter = require("./src/routes/forgotPassword");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json()); 

app.use("/user", SignupRouter);
app.use("/auth", loginRouter);
app.use("/auth", forgotPasswordRouter);

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