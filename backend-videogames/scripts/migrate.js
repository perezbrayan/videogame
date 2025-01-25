const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/db');

async function executeMigration(connection, sql) {
  const statements = sql.split(';').filter(stmt => stmt.trim());
  for (let statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  });

  try {
    // Crear tabla de migraciones si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Obtener migraciones ejecutadas
    const [executedMigrations] = await connection.query('SELECT name FROM migrations');
    const executedNames = executedMigrations.map(m => m.name);

    // Leer archivos de migración
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Ejecutar migraciones pendientes
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`Ejecutando migración: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf8');
        
        await executeMigration(connection, sql);
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
        
        console.log(`Migración completada: ${file}`);
      }
    }

    console.log('Todas las migraciones han sido ejecutadas.');
  } catch (error) {
    console.error('Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
