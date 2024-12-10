const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/search', bookController.searchBooks);
router.get('/statistics', bookController.getStatistics);

router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);

module.exports = router;