-- Actualizar la contraseña del usuario admin
-- La contraseña 'admin123' hasheada con bcrypt
UPDATE users 
SET user_password = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa' 
WHERE email = 'admin@videogames.com';
