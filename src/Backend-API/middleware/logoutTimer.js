
const jwt = require('jsonwebtoken');

console.log("logoutTimer middleware loaded");
const logoutTimer = (req, res, next) => {
  console.log("logoutTimer middleware called");
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If there's no token, just move to the next middleware
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token is about to expire (e.g., in the next 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    
    if (timeUntilExpiry <= 300) { // 300 seconds = 5 minutes
      // Token is about to expire, attach a flag to the request
      req.tokenNearExpiry = true;
    }

    // Attach the decoded user information to the request
    req.user = decoded.user;
    
    next();
  } catch (err) {
    // If the token is invalid or expired, don't throw an error
    // Just remove the token and continue
    res.clearCookie('token');
    next();
  }
};

module.exports = logoutTimer;