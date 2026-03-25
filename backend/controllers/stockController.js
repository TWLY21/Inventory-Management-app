const asyncHandler = require('../utils/asyncHandler');
const stockService = require('../services/stockService');

exports.stockIn = asyncHandler(async (req, res) => {
  const product = await stockService.stockIn({
    productId: req.body.productId,
    quantity: req.body.quantity,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: 'Stock added successfully',
    data: product,
  });
});

exports.stockOut = asyncHandler(async (req, res) => {
  const product = await stockService.stockOut({
    productId: req.body.productId,
    quantity: req.body.quantity,
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: 'Stock removed successfully',
    data: product,
  });
});

