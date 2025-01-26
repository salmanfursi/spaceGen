const express = require("express");
const mongoose = require("mongoose");
const profileRoutes = require("./routes/profile");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Routes
app.use("/", profileRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend 2 running on port ${PORT}`));