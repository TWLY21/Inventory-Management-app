const express = require('express');

const stockController = require('../controllers/stockController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/in', stockController.stockIn);
router.post('/out', stockController.stockOut);

module.exports = router;

