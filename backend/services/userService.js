const db = require('../db');

async function getAllUsers() {
  const result = await db.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
}

module.exports = {
  getAllUsers,
};

