const mongoose = require("mongoose");

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
    },
    role: {
        type: String,
        default: "user"
    },
    // 👇 The new fields for OTP
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);