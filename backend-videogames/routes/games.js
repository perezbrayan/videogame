const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/games';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único y seguro
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
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

// Función para obtener juegos con filtros
async function getGames(req, res) {
  try {
    const { 
      platform, 
      sort = 'newest',
      search,
      limit = 50,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        g.*,
        d.name as developer_name,
        CASE 
          WHEN g.discount_percentage > 0 
          THEN ROUND(g.base_price * (1 - g.discount_percentage/100), 2)
          ELSE g.base_price 
        END as final_price,
        CASE
          WHEN g.image_url IS NOT NULL AND g.image_url != ''
          THEN CONCAT('/uploads/games/', g.image_url)
          ELSE NULL
        END as image_url
      FROM games g 
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      WHERE 1=1
    `;
    
    const queryParams = [];

    // Filtrar por plataforma
    if (platform && platform !== 'all') {
      query += ` AND g.platform = ?`;
      queryParams.push(platform);
    }

    // Búsqueda por título o desarrollador
    if (search) {
      query += ` AND (g.title LIKE ? OR d.name LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Ordenamiento
    switch (sort) {
      case 'price-asc':
        query += ` ORDER BY final_price ASC`;
        break;
      case 'price-desc':
        query += ` ORDER BY final_price DESC`;
        break;
      case 'name':
        query += ` ORDER BY g.title ASC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY g.release_date DESC`;
    }

    // Paginación
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), Number(offset));

    const [games] = await pool.query(query, queryParams);
    const [totalCount] = await pool.query(
      'SELECT COUNT(*) as total FROM games WHERE 1=1' + 
      (platform && platform !== 'all' ? ' AND platform = ?' : ''),
      platform && platform !== 'all' ? [platform] : []
    );

    res.json({
      games,
      pagination: {
        total: totalCount[0].total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error) {
    console.error('Error getting games:', error);
    res.status(500).json({ 
      message: 'Error al obtener los juegos',
      error: error.message 
    });
  }
}

// Obtener un juego específico con información completa
router.get('/:id', async (req, res) => {
  try {
    const [games] = await pool.query(`
      SELECT 
        g.*,
        d.name as developer_name,
        CASE 
          WHEN g.discount_percentage > 0 
          THEN ROUND(g.base_price * (1 - g.discount_percentage/100), 2)
          ELSE g.base_price 
        END as final_price,
        CASE
          WHEN g.image_url IS NOT NULL AND g.image_url != ''
          THEN CONCAT('/uploads/games/', g.image_url)
          ELSE NULL
        END as image_url
      FROM games g 
      LEFT JOIN developers d ON g.developer_id = d.developer_id 
      WHERE g.game_id = ?
    `, [req.params.id]);

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
});

// Rutas GET (públicas)
router.get('/', getGames);

// Crear un nuevo juego (protegida)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      developer_name,
      release_date,
      base_price, 
      stock, 
      discount_percentage,
      platform 
    } = req.body;
    
    // Primero, buscar o crear el desarrollador
    let developerId;
    const [developer] = await pool.query(
      'SELECT developer_id FROM developers WHERE name = ?',
      [developer_name]
    );

    if (developer.length > 0) {
      developerId = developer[0].developer_id;
    } else {
      // Si el desarrollador no existe, crearlo
      const [newDeveloper] = await pool.query(
        'INSERT INTO developers (name) VALUES (?)',
        [developer_name]
      );
      developerId = newDeveloper.insertId;
    }

    const image_url = req.file ? req.file.filename : null;

    // Insertar el nuevo juego
    const [result] = await pool.query(
      `INSERT INTO games (
        title, 
        description, 
        developer_id, 
        release_date,
        base_price, 
        stock, 
        discount_percentage, 
        image_url, 
        platform
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        developerId,
        release_date,
        base_price,
        stock,
        discount_percentage || 0,
        image_url,
        platform || 'pc'
      ]
    );

    // Obtener el juego recién creado con el nombre del desarrollador
    const [newGame] = await pool.query(
      `SELECT g.*, d.name as developer_name,
      CASE
        WHEN g.image_url IS NOT NULL AND g.image_url != ''
        THEN CONCAT('/uploads/games/', g.image_url)
        ELSE NULL
      END as image_url
      FROM games g 
      LEFT JOIN developers d ON g.developer_id = d.developer_id 
      WHERE g.game_id = ?`,
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

// Ruta para actualizar un juego
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const gameId = req.params.id;
    const {
      title,
      description,
      developer_name,
      release_date,
      base_price,
      stock,
      discount_percentage,
      platform
    } = req.body;

    // Validar el descuento
    const parsedDiscount = parseFloat(discount_percentage) || 0;
    if (parsedDiscount < 0 || parsedDiscount > 100) {
      return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100' });
    }

    // Validar el precio base
    const parsedPrice = parseFloat(base_price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'El precio base debe ser un número positivo' });
    }

    // Primero verificar si el juego existe
    const [existingGame] = await pool.query(
      'SELECT * FROM games WHERE game_id = ?',
      [gameId]
    );

    if (existingGame.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Obtener el ID del desarrollador o crear uno nuevo si no existe
    let developerId;
    const [developer] = await pool.query(
      'SELECT developer_id FROM developers WHERE name = ?',
      [developer_name]
    );

    if (developer.length > 0) {
      developerId = developer[0].developer_id;
    } else {
      const [newDeveloper] = await pool.query(
        'INSERT INTO developers (name) VALUES (?)',
        [developer_name]
      );
      developerId = newDeveloper.insertId;
    }

    // Construir la consulta de actualización
    let updateQuery = `
      UPDATE games 
      SET title = ?,
          description = ?,
          developer_id = ?,
          release_date = ?,
          base_price = ?,
          stock = ?,
          discount_percentage = ?,
          platform = ?
    `;
    
    let queryParams = [
      title,
      description,
      developerId,
      release_date,
      parsedPrice,
      stock,
      parsedDiscount,
      platform
    ];

    // Manejar la actualización de la imagen solo si se proporciona una nueva
    if (req.file) {
      updateQuery += ', image_url = ?';
      queryParams.push(req.file.filename);

      // Eliminar la imagen anterior si existe
      if (existingGame[0].image_url) {
        const oldImagePath = path.join(__dirname, '../uploads/games', existingGame[0].image_url);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error al eliminar la imagen anterior:', err);
          // Continuar con la actualización incluso si hay error al eliminar la imagen
        }
      }
    }

    updateQuery += ' WHERE game_id = ?';
    queryParams.push(gameId);

    // Ejecutar la actualización
    await pool.query(updateQuery, queryParams);

    // Obtener el juego actualizado con el nombre del desarrollador
    const [updatedGame] = await pool.query(`
      SELECT g.*, d.name as developer_name,
      CASE
        WHEN g.discount_percentage > 0 
        THEN ROUND(g.base_price * (1 - g.discount_percentage/100), 2)
        ELSE g.base_price 
      END as final_price,
      CASE
        WHEN g.image_url IS NOT NULL AND g.image_url != ''
        THEN CONCAT('/uploads/games/', g.image_url)
        ELSE NULL
      END as image_url
      FROM games g 
      LEFT JOIN developers d ON g.developer_id = d.developer_id 
      WHERE g.game_id = ?
    `, [gameId]);

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
