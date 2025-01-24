const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar la conexión
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Please check your database credentials in the .env file');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database server is not running');
    }
  });

module.exports = pool;
