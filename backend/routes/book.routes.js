const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const conditionalMulter = require('../middleware/conditional-multer');

router.get('/', bookCtrl.getBooks);
router.post('/', auth, multer, bookCtrl.createBook);

router.get('/bestrating', bookCtrl.getBestRatedBooks);  // <-- ici avant /:id

router.get('/:id', bookCtrl.getBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, conditionalMulter, bookCtrl.updateBook);

router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
