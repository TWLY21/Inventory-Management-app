const db = require('../db');
const ApiError = require('../utils/ApiError');

async function updateStock({ productId, userId, quantity, type }) {
  const normalizedQuantity = Number(quantity);

  if (!productId || !normalizedQuantity || normalizedQuantity <= 0) {
    throw new ApiError(400, 'Product ID and a positive quantity are required');
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const productResult = await client.query(
      'SELECT id, name, quantity FROM products WHERE id = $1 FOR UPDATE',
      [productId]
    );

    const product = productResult.rows[0];
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const nextQuantity =
      type === 'IN' ? product.quantity + normalizedQuantity : product.quantity - normalizedQuantity;

    if (nextQuantity < 0) {
      throw new ApiError(400, 'Insufficient stock for this operation');
    }

    const updatedProductResult = await client.query(
      'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING id, name, quantity, price, description, created_at',
      [nextQuantity, productId]
    );

    await client.query(
      `INSERT INTO stock_logs (product_id, user_id, type, quantity)
       VALUES ($1, $2, $3, $4)`,
      [productId, userId, type, normalizedQuantity]
    );

    await client.query('COMMIT');

    return updatedProductResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  stockIn: (payload) => updateStock({ ...payload, type: 'IN' }),
  stockOut: (payload) => updateStock({ ...payload, type: 'OUT' }),
};

