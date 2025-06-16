// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   console.log('Dans auth.js, req.headers.authorization =', req.headers.authorization);
  try {
    console.log('Authorization header:', req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decodedToken);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
