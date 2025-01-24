-- Crear la tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,  -- Usamos user_password en lugar de password para evitar palabras reservadas
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar el usuario administrador
-- La contraseña es 'admin123' (será hasheada por el backend)
INSERT INTO users (email, user_password, name, role, created_at)
VALUES ('admin@videogames.com', '$2a$10$YourHashedPasswordHere', 'Administrador', 'admin', NOW());
