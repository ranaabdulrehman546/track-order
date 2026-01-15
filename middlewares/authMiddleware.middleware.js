// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const secretKey = "syook"; // Replace with your actual secret key

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access : No token provided." });
  }

  // Extract token from "Bearer <token>" format or use token directly
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access : No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
