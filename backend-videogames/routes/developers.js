const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all developers
router.get('/', async (req, res) => {
  console.log('[Developers] Getting all developers');
  try {
    const [developers] = await pool.query(
      'SELECT developer_id, name, country, website, created_at FROM developers ORDER BY developer_id ASC'
    );
    console.log(`[Developers] Found ${developers.length} developers`);
    res.json(developers);
  } catch (error) {
    console.error('[Developers] Error getting developers:', error);
    res.status(500).json({ 
      message: 'Error getting developers',
      error: error.message 
    });
  }
});

// Get a single developer
router.get('/:id', async (req, res) => {
  console.log(`[Developers] Getting developer with id ${req.params.id}`);
  try {
    const [developer] = await pool.query(
      'SELECT developer_id, name, country, website, created_at FROM developers WHERE developer_id = ?',
      [req.params.id]
    );

    if (developer.length === 0) {
      console.log(`[Developers] Developer with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Developer not found' });
    }

    console.log(`[Developers] Found developer: ${developer[0].name}`);
    res.json(developer[0]);
  } catch (error) {
    console.error('[Developers] Error getting developer:', error);
    res.status(500).json({ 
      message: 'Error getting developer',
      error: error.message 
    });
  }
});

module.exports = router;
