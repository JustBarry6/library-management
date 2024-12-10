const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const bookRoutes = require('./bookRoutes');

router.get('/statistics', bookController.getStatistics);
router.use('/books', bookRoutes);

module.exports = router;
