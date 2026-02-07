const mongoose = require("../configuration/dbConfig");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    }
        ,
  otp: { type: String },
  otpExpires: { type: Date },
  role: { type: String, enum: ["admin", "customer"], default: "user" },
});
module.exports = mongoose.model("user", userSchema);
