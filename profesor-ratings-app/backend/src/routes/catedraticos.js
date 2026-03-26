const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todos los catedráticos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM catedraticos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
