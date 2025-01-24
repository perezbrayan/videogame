const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger');
require('dotenv').config();

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(logger);

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta base para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Videogames Store API',
    status: 'API is running successfully',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      games: '/api/games',
      platforms: '/api/platforms',
      categories: '/api/categories',
      developers: '/api/developers'
    }
  });
});

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/platforms', require('./routes/platforms'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/developers', require('./routes/developers'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
