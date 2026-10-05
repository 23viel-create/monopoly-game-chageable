const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { parseSingleImage, uploadImage } = require('../controllers/uploadController');

//protect runs first, so files from unauthenticated requests are never read
router.post('/', protect, parseSingleImage, uploadImage);

module.exports = router;
