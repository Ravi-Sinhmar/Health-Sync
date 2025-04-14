const jwt = require("jsonwebtoken")

exports.authenticate = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")

    // Add user from payload to request
    req.user = decoded
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}