// 1. Setup Environment Variables
require("dotenv").config();

// 2. Import Libraries using 'require' (Standard Node.js)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("mongoose");

// 3. Import Your Routes & Scripts
const SignupRouter = require("./src/routes/signup");
const loginRouter = require("./src/routes/login");
const CreateAdminAccount = require("./src/scripts/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middleware
app.use(bodyParser.json());
app.use(cors());

// 5. Basic Route
app.get("/", (req, res) => {
  res.send("Server is successfully connected");
});

// 6. API Routes
app.use("/user", SignupRouter); // Maps to /user/register or /user/signup
app.use("/auth", loginRouter); // Maps to /auth/login

// 7. Database Connection
const MONGO_URI = process.env.MONGO_URI || process.env.Mongo_db_URI;

if (!MONGO_URI) {
  console.error("❌ Mongo_db_URI is missing. Check your .env file.");
  process.exit(1);
}

connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Run the admin script safely
    try {
      if (typeof CreateAdminAccount === "function") {
        CreateAdminAccount();
      } else {
        console.log("Admin script loaded.");
      }
    } catch (err) {
      console.log("⚠️ Admin script skipped or had an error:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
