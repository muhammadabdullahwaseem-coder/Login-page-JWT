const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 3. Create new user
        const newUser = new User({
            name, 
            email, 
            password: hashedPassword,
            role: "user"
        });

        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser, message: "User created successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};