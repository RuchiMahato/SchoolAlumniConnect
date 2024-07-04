// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Check if there is a token
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {

    const decoded = jwt.verify(token, config.get('adminJwtSecret'));
  
      req.admin = decoded.admin;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
