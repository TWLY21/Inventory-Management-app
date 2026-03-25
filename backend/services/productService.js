const db = require('../db');
const ApiError = require('../utils/ApiError');

function validateProductPayload({ name, quantity, price }) {
  if (!name || !String(name).trim()) {
    throw new ApiError(400, 'Product name is required');
  }

  const normalizedQuantity = Number(quantity);
  const normalizedPrice = Number(price);

  if (Number.isNaN(normalizedQuantity) || normalizedQuantity < 0) {
    throw new ApiError(400, 'Quantity must be a non-negative number');
  }

  if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
    throw new ApiError(400, 'Price must be a non-negative number');
  }
}

async function getAllProducts() {
  const result = await db.query(
    `SELECT id, name, description, quantity, price, created_at
     FROM products
     ORDER BY created_at DESC`
  );

  return result.rows;
}

async function createProduct(payload) {
  const { name, description = '', quantity = 0, price = 0 } = payload;

  validateProductPayload({ name, quantity, price });

  const result = await db.query(
    `INSERT INTO products (name, description, quantity, price)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, quantity, price, created_at`,
    [name.trim(), description.trim(), Number(quantity), Number(price)]
  );

  return result.rows[0];
}

async function updateProduct(productId, payload) {
  const { name, description = '', quantity, price } = payload;
  validateProductPayload({ name, quantity, price });

  const existing = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!existing.rows[0]) {
    throw new ApiError(404, 'Product not found');
  }

  const result = await db.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         quantity = $3,
         price = $4
     WHERE id = $5
     RETURNING id, name, description, quantity, price, created_at`,
    [name?.trim(), description.trim(), Number(quantity), Number(price), productId]
  );

  return result.rows[0];
}

async function deleteProduct(productId) {
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [productId]);

  if (!result.rows[0]) {
    throw new ApiError(404, 'Product not found');
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
