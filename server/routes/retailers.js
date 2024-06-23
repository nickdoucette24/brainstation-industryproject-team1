const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Endpoint to fetch retailers
router.get('/', async (req, res) => {
  try {
    const retailers = await knex('retailers').select('*');
    res.json(retailers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch retailers' });
  }
});

module.exports = router;