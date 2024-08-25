const jwt = require('jsonwebtoken');

const verifyToken= (req, res, next) => {
  // Get token from header
   const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      role: user.role
    }
  };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = { verifyToken, generateToken };