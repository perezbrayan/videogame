const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function generateHashedPassword() {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '..', 'migrations', '005_create_admin_user.sql');
    let migrationContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Reemplazar el placeholder con el hash real
    migrationContent = migrationContent.replace('$2a$10$YourHashedPasswordHere', hashedPassword);
    
    // Guardar el archivo actualizado
    fs.writeFileSync(migrationPath, migrationContent);
    
    console.log('Migration file updated with hashed password');
    console.log('You can now run the migration file');
    console.log('Admin credentials:');
    console.log('Email: admin@videogames.com');
    console.log('Password: admin123');
}

generateHashedPassword().catch(console.error);
