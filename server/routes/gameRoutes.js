const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createGame, updateGameDetails } = require('../controllers/gameController');

//Every games route needs a logged-in user
router.use(protect);

router.post('/', createGame);
router.patch('/:id', updateGameDetails);

module.exports = router;
