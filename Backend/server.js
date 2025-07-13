require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Configure CORS properly
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth routes (handles register, login, etc)
app.use("/api/auth", require("./routes/auth"));

// Fix the submissions route mounting
app.use('/api/submissions', require('./routes/submitrout'));

// Root test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    console.log("MongoDB connected");
    await createDefaultAdmins(); // <-- Create admin and superadmin if not present
  })
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// --------- Admin and SuperAdmin creation logic ---------
async function createDefaultAdmins() {
  const User = require("./models/user");

  const defaultUsers = [
    {
      username: "admin",
      password: "admin@123", // Change to a secure password!
      role: "Admin",
      pacsName: "Admin PACS"
    },
    {
      username: "superadmin",
      password: "superadmin@123", // Change to a secure password!
      role: "SuperAdmin",
      pacsName: "SuperAdmin PACS"
    }
  ];

  for (const userData of defaultUsers) {
    const exists = await User.findOne({ username: userData.username });
    if (!exists) {
      const user = new User(userData);
      await user.save();
      console.log(`Created default ${userData.role}: ${userData.username}`);
    }
  }
}