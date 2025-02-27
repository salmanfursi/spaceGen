// backend2/middleware/authMiddleware.js
const validateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("header token--->",token);
  if (!token || token !== process.env.SHARED_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = validateToken;