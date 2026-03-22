const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Crear una observación (POST)
router.post('/', (req, res) => {
  const { participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta } = req.body;
  const sql = 'INSERT INTO observaciones (participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Observación guardada' });
  });
});

// Obtener todas las observaciones (GET)
router.get('/', (req, res) => {
  db.query('SELECT * FROM observaciones', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;