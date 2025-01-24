const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        // Generar hash de la contraseña
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Eliminar usuario admin si existe
        await pool.query(
            'DELETE FROM users WHERE email = ?',
            ['admin@videogames.com']
        );

        // Crear nuevo usuario admin
        const [result] = await pool.query(
            'INSERT INTO users (email, user_password, name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            ['admin@videogames.com', hashedPassword, 'Administrador', 'admin']
        );

        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@videogames.com');
        console.log('Contraseña: admin123');
        console.log('Hash generado:', hashedPassword);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

createAdmin();
