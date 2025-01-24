const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function checkUser() {
    try {
        // Verificar si el usuario existe
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            ['admin@videogames.com']
        );

        if (users.length === 0) {
            console.log('Usuario no encontrado');
            return;
        }

        console.log('Usuario encontrado:', users[0]);

        // Crear un nuevo hash para comparar
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('\nNuevo hash generado:', hashedPassword);
        console.log('Hash almacenado:', users[0].user_password);

        // Verificar si la contraseña coincide
        const isValid = await bcrypt.compare(password, users[0].user_password);
        console.log('\n¿La contraseña coincide?:', isValid);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkUser();
