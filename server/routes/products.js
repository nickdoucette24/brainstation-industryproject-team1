const express = require('express');
const router = express.Router();
const knex = require('../knex'); 

// Endpoint to fetch products
router.get('/', async (req, res) => {
  try {
    const products = await knex('products').select('*');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;