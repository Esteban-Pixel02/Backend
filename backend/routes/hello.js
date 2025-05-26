const express = require('express');
const router = express.Router();

// Route simple
router.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

// Route dynamique avec :name
router.get('/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hello ${name}!` });
});

module.exports = router;
