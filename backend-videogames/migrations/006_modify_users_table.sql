-- Modificar la tabla users para agregar la columna user_password
ALTER TABLE users ADD COLUMN user_password VARCHAR(255) NOT NULL;

-- Insertar el usuario administrador
INSERT INTO users (email, user_password, name, role, created_at)
VALUES ('admin@videogames.com', '$2a$10$8Ux8ytr9O7YdPHKvnhFGxeZeGHXBR0ptSZVdYJxOPPYjFKP1vQIjy', 'Administrador', 'admin', NOW());

-- La contraseña es 'admin123' (ya hasheada)
