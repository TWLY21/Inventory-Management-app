const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');

exports.getUsers = asyncHandler(async (_req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
});
