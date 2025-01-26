// backend2/routes/profile.js
const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const validateToken = require("../middleware/authMiddleware"); // Import middleware

// Apply middleware to all routes
// router.use(validateToken);

router.post("/profile", async (req, res) => {
  try {
    const { userId, bio, interests } = req.body;
    const profile = new Profile({ userId, bio, interests });
    await profile.save();
    res.status(201).json({ message: "Profile created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/profile", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await Profile.find({});
    console.log('users',users)
        // Respond with the list of users
        res.status(200).json({ message: "Users retrieved successfully", users });
      } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Error retrieving users", error: error.message });
      }
});


router.get("/", async (req, res) => {
    res.status(200).json("joy bangla");
});

module.exports = router;