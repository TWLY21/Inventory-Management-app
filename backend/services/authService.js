const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function buildTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

function signUserToken(user) {
  return jwt.sign(buildTokenPayload(user), env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function findUserByEmail(email) {
  const result = await db.query(
    'SELECT id, name, email, password, role, created_at FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
}

async function registerUser(payload, currentUser) {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  if (!env.allowPublicRegistration && (!currentUser || currentUser.role !== 'ADMIN')) {
    throw new ApiError(403, 'Only admins can register new users');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const assignedRole =
    currentUser && currentUser.role === 'ADMIN' && role ? role.toUpperCase() : 'USER';

  if (!['ADMIN', 'USER'].includes(assignedRole)) {
    throw new ApiError(400, 'Role must be ADMIN or USER');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name.trim(), email.toLowerCase(), hashedPassword, assignedRole]
  );

  const user = result.rows[0];

  return {
    user,
    token: signUserToken(user),
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signUserToken(user);

  return {
    user: buildTokenPayload(user),
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};

