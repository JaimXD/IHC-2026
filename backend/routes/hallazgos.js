const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora } = req.body;
  const sql = 'INSERT INTO hallazgos (prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Hallazgo guardado' });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM hallazgos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;