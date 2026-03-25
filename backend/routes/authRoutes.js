const express = require('express');

const authController = require('../controllers/authController');
const { optionalAuthenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', optionalAuthenticate, authController.register);

module.exports = router;

