const jwt = require('jsonwebtoken');

const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function parseToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
}

function attachUser(req, required) {
  const token = parseToken(req);

  if (!token) {
    if (required) {
      throw new ApiError(401, 'Authentication required');
    }
    return;
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}

function authenticate(req, _res, next) {
  try {
    attachUser(req, true);
    next();
  } catch (error) {
    next(error);
  }
}

function optionalAuthenticate(req, _res, next) {
  try {
    attachUser(req, false);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate,
};

