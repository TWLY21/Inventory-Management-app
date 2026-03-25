const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/productService');

exports.getProducts = asyncHandler(async (_req, res) => {
  const products = await productService.getAllProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

