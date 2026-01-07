const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the header has "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Decode the token to get the User ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user and attach it to the request (so we know WHO is asking)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next step
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };