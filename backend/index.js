const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // Carga las variables del .env

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});