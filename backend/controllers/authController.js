const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

exports.register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body, req.user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data,
  });
});

