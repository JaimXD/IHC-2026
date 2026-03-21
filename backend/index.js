const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const pruebasRoutes = require('./routes/pruebas');

// Usar rutas
app.use('/api/pruebas', pruebasRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});