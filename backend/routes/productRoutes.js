const express = require('express');

const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', productController.getProducts);
router.post('/', authorizeRoles('ADMIN'), productController.createProduct);
router.put('/:id', authorizeRoles('ADMIN'), productController.updateProduct);
router.delete('/:id', authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;

