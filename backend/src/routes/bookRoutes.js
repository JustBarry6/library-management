const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Routes existantes
router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);

// Nouvelles routes
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Route de recherche
router.get('/search', bookController.searchBooks);

// Route de statistiques
router.get('/statistics', bookController.getStatistics);

module.exports = router;