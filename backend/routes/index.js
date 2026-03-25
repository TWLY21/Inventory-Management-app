const express = require('express');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const stockRoutes = require('./stockRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/stock', stockRoutes);
router.use('/users', userRoutes);

module.exports = router;

