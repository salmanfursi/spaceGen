const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const bcrypt = require("bcrypt");


router.post("/user", async (req, res) => {
    try {
      const { username, email, password, bio, interests } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save sensitive data to Backend 1
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      // Forward non-sensitive data to Backend 2
      await axios.post("http://localhost:5001/profile", {
        userId: user._id,
        bio,
        interests,
      },
      {
        headers: {
          'Authorization': process.env.SHARED_SECRET
        }
      }
    
    );
  
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch non-sensitive data from Backend 2
    // const profileResponse = await axios.get(
    //   `http://localhost:5001/profile/${user._id}`
    // );
    const profileResponse = await axios.get(
      `http://localhost:5001/profile/${user._id}`,
      {
        headers: {
          'Authorization': process.env.SHARED_SECRET
        }
      }
    );

    // Combine data
    const responseData = {
      username: user.username,
      email: user.email,
      bio: profileResponse.data.bio,
      interests: profileResponse.data.interests,
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/users", async (req, res) => {
  try {
  
    const user = await User.find({});

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

module.exports = router;






