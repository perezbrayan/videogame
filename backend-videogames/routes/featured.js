const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Obtener juegos destacados
router.get('/', async (req, res) => {
  try {
    // Primero verificar si la tabla existe
    const [tables] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'featured_games'
    `);

    // Si la tabla no existe, crearla
    if (tables[0].count === 0) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS featured_games (
          id INT PRIMARY KEY AUTO_INCREMENT,
          game_id INT NOT NULL,
          position INT DEFAULT 0,
          FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
        )
      `);
    }

    // Obtener juegos destacados
    const [featuredGames] = await pool.query(`
      SELECT g.*, d.name as developer_name, f.position,
      CASE
        WHEN g.image_url IS NOT NULL AND g.image_url != ''
        THEN CONCAT('/uploads/games/', g.image_url)
        ELSE NULL
      END as image_url
      FROM featured_games f
      JOIN games g ON f.game_id = g.game_id
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      ORDER BY f.position ASC
    `);

    res.json(featuredGames);
  } catch (error) {
    console.error('Error getting featured games:', error);
    res.status(500).json({ 
      message: 'Error al obtener juegos destacados',
      error: error.message 
    });
  }
});

// Actualizar juegos destacados
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { featuredGames } = req.body;

    // Iniciar transacción
    await pool.query('START TRANSACTION');

    // Limpiar juegos destacados actuales
    await pool.query('DELETE FROM featured_games');

    // Insertar nuevos juegos destacados
    if (featuredGames && featuredGames.length > 0) {
      const values = featuredGames.map((gameId, index) => [gameId, index]);
      await pool.query(
        'INSERT INTO featured_games (game_id, position) VALUES ?',
        [values]
      );
    }

    // Confirmar transacción
    await pool.query('COMMIT');

    res.json({ message: 'Juegos destacados actualizados exitosamente' });
  } catch (error) {
    // Revertir transacción en caso de error
    await pool.query('ROLLBACK');
    console.error('Error updating featured games:', error);
    res.status(500).json({ 
      message: 'Error al actualizar juegos destacados',
      error: error.message 
    });
  }
});

module.exports = router;
