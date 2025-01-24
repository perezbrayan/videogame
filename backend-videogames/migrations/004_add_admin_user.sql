-- Insertar usuario administrador por defecto
-- La contraseña es 'admin123' (será hasheada por el backend)
INSERT INTO users (email, password, name, role, created_at)
VALUES ('admin@videogames.com', 'admin123', 'Administrador', 'admin', NOW());
