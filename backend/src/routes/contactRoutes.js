const express = require('express');
const router = express.Router();
const { submitQuery } = require('../controllers/contactController');

router.post('/', submitQuery);

module.exports = router;
