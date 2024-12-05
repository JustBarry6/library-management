const express = require('express');
const router = express.Router();
const bookRoutes = require('./bookRoutes');

router.use('/books', bookRoutes);

module.exports = router;
