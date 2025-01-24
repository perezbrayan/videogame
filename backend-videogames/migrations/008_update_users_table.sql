-- Primero, desactivar temporalmente la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar la tabla users si existe
DROP TABLE IF EXISTS users;

-- Crear la tabla users con la estructura correcta
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar el usuario administrador
-- La contraseña es 'admin123' (ya hasheada)
INSERT INTO users (email, user_password, name, role, created_at)
VALUES ('admin@videogames.com', '$2a$10$8Ux8ytr9O7YdPHKvnhFGxeZeGHXBR0ptSZVdYJxOPPYjFKP1vQIjy', 'Administrador', 'admin', NOW());

-- Reactivar la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
