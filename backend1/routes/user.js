const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const bcrypt = require("bcrypt");


// router.post("/user", async (req, res) => {
//   try {
//     const { username, email, password, bio, interests } = req.body;

//     // Save sensitive data to Backend 1
//     const user = new User({ username, email, password });
//     await user.save();

//     // Forward non-sensitive data to Backend 2
//     await axios.post("http://localhost:5001/profile", {
//       userId: user._id,
//       bio,
//       interests,
//     });

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


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
      });
  
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
    const profileResponse = await axios.get(
      `http://localhost:5001/profile/${user._id}`
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
      // Fetch all users from Backend 1 (sensitive data)
      const users = await User.find({}).select("+password");  
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // Fetch all profiles from Backend 2 (non-sensitive data)
      const profileResponse = await axios.get("http://localhost:5001/profile");
   console.log('---------<><>',profileResponse.data.users)
      // Check if profileResponse.data exists and has a 'users' property
      if (!profileResponse?.data?.users) {
        return res.status(404).json({ message: "No profiles found" });
      }
  
      // Extract the profiles array from profileResponse.data
      const profiles = profileResponse.data.users;
  
      // Combine the data
      const combinedData = users.map((user) => {
        const profile = profiles.find(
          (profile) => profile.userId === user._id.toString()
        );
  
        return {
          userId: user._id,
          username: user.username,
          email: user.email,
          password: user.password, 
          bio: profile ? profile.bio : null,
          interests: profile ? profile.interests : null,
        };
      });
  
      console.log("combinedData", combinedData);
  
      // Respond with the combined data
      res.status(200).json({ message: "Data retrieved successfully", data: combinedData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;






