// middleware/conditional-multer.js
const multer = require('./multer-config'); // ton multer config existante

module.exports = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    multer(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: 'Erreur lors de l\'upload' });
      }
      next();
    });
  } else {
    next();
  }
};
