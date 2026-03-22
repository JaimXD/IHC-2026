const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const pruebasRoutes = require('./routes/pruebas');
const tareasRoutes = require('./routes/tareas');
const participantesRoutes = require('./routes/participantes');
const observacionesRoutes = require('./routes/observaciones');
const hallazgosRoutes = require('./routes/hallazgos');

// Usar rutas
app.use('/api/pruebas', pruebasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/hallazgos', hallazgosRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});