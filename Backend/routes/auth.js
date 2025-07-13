const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register route (always creates a User role)
router.post("/register", async (req, res) => {
  try {
    const { pacsName, username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "PACS ID and password required" });

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "PACS ID already exists" });

    const user = new User({ pacsName, username, password, role: "User" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route (works for all roles)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "PACS ID and password required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ 
      message: "Login successful", 
      role: user.role, 
      username: user.username,
      userId: user._id // This line sends the user's MongoDB ID to the frontend
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
