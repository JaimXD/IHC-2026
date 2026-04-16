const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ihc_2026',
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.warn('⚠️  Advertencia: No se pudo conectar a MySQL:', err.message);
    console.warn('El servidor API funcionará pero sin acceso a la base de datos');
  } else {
    console.log('✓ ¡Conectado a MySQL!');
  }
});

// Manejar desconexiones
db.on('error', (err) => {
  console.error('Error en la conexión a MySQL:', err.message);
});

module.exports = db;