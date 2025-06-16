const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const conditionalMulter = require('../middleware/conditional-multer');

router.get('/',bookCtrl.getBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id',bookCtrl.getBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


router.put('/:id', auth,conditionalMulter, bookCtrl.updateBook);

module.exports = router;
