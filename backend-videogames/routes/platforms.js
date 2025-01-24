const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all platforms
router.get('/', async (req, res) => {
  try {
    const [platforms] = await pool.query('SELECT * FROM platforms');
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
