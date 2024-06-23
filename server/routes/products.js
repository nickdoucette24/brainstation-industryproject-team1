const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Endpoint to fetch products
router.get('/products', async (req, res) => {
  try {
    const products = await knex('products').select('*');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;