const jwt = require('jsonwebtoken');

const verifyToken= (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
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
      isAdmin: user.isAdmin || false
    }
  };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};


module.exports = { verifyToken, generateToken };