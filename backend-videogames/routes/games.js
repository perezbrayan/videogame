const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/games/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'game-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
});

// Función para obtener juegos
async function getGames(req, res) {
  try {
    const [games] = await pool.query(`
      SELECT g.*, d.name as developer_name 
      FROM games g 
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      ORDER BY g.game_id DESC
    `);
    
    res.json(games);
  } catch (error) {
    console.error('Error getting games:', error);
    res.status(500).json({ 
      message: 'Error al obtener los juegos',
      error: error.message 
    });
  }
}

// Función para obtener un juego por ID
async function getGameById(req, res) {
  try {
    const [games] = await pool.query(
      `SELECT g.*, d.name as developer_name 
       FROM games g 
       LEFT JOIN developers d ON g.developer_id = d.developer_id
       WHERE g.game_id = ?`,
      [req.params.id]
    );

    if (games.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.json(games[0]);
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ 
      message: 'Error al obtener el juego',
      error: error.message 
    });
  }
}

// Rutas GET (públicas)
router.get('/', getGames);
router.get('/:id', getGameById);

// Crear un nuevo juego (protegida)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, developer_id, base_price, stock } = req.body;
    const image_url = req.file ? '/uploads/games/' + req.file.filename : null;

    const [result] = await pool.query(
      'INSERT INTO games (title, description, developer_id, base_price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, developer_id, base_price, stock, image_url]
    );

    const [newGame] = await pool.query(
      'SELECT g.*, d.name as developer_name FROM games g LEFT JOIN developers d ON g.developer_id = d.developer_id WHERE g.game_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Juego creado exitosamente',
      game: newGame[0]
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      message: 'Error al crear el juego',
      error: error.message 
    });
  }
});

// Actualizar un juego (protegida)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, developer_id, base_price, stock } = req.body;
    const gameId = req.params.id;

    let updateQuery = 'UPDATE games SET title = ?, description = ?, developer_id = ?, base_price = ?, stock = ?';
    let queryParams = [title, description, developer_id, base_price, stock];

    if (req.file) {
      updateQuery += ', image_url = ?';
      queryParams.push('/uploads/games/' + req.file.filename);
    }

    updateQuery += ' WHERE game_id = ?';
    queryParams.push(gameId);

    await pool.query(updateQuery, queryParams);

    const [updatedGame] = await pool.query(
      'SELECT g.*, d.name as developer_name FROM games g LEFT JOIN developers d ON g.developer_id = d.developer_id WHERE g.game_id = ?',
      [gameId]
    );

    if (updatedGame.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.json({
      message: 'Juego actualizado exitosamente',
      game: updatedGame[0]
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el juego',
      error: error.message 
    });
  }
});

// Eliminar un juego (protegida)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM games WHERE game_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.json({ message: 'Juego eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el juego',
      error: error.message 
    });
  }
});

module.exports = router;
