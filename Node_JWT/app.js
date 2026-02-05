require("dotenv").config();
const express = require("express");
const SignupRouter = require("./src/routes/signup");
const loginRouter = require("./src/routes/login");
const { json } = require("body-parser");
const cors = require("cors");
const CreateAdminAccount = require("./src/scripts/admin");
const { connect } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is successfully connected");
});

app.use("/user", SignupRouter);
app.use("/auth", loginRouter);

const MONGO_URI = process.env.MONGO_URI || process.env.Mongo_db_URI;

if (!MONGO_URI) {
  console.error("❌ Mongo_db_URI is missing. Check your .env file in the backend folder.");
  process.exit(1);
}

connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    CreateAdminAccount();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
