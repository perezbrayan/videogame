const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Si es una ruta de autenticación, permitir acceso
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }

  // Si es una solicitud GET a rutas específicas, permitir acceso
  if (req.method === 'GET' && (
    req.path === '/api/games' ||
    req.path.startsWith('/api/games/') ||
    req.path === '/api/developers' ||
    req.path.startsWith('/api/developers/') ||
    req.path === '/api/platforms' ||
    req.path.startsWith('/api/platforms/') ||
    req.path === '/api/categories' ||
    req.path.startsWith('/api/categories/')
  )) {
    return next();
  }

  // Para el resto de rutas, verificar el token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
