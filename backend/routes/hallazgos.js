const express = require('express');
const router = express.Router();
const db = require('../config/db');
const validators = require('../validators');

router.post('/', (req, res) => {
  const validation = validators.validateHallazgo(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validación fallida', detalles: validation.errors });
  }

  const { prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora } = req.body;
  const sql = 'INSERT INTO hallazgos (prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Hallazgo guardado exitosamente' });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM hallazgos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM hallazgos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Hallazgo no encontrado' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const validation = validators.validateHallazgo(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validación fallida', detalles: validation.errors });
  }

  const { id } = req.params;
  const { prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora } = req.body;
  const sql = 'UPDATE hallazgos SET prueba_id = ?, frecuencia = ?, severidad = ?, prioridad = ?, estado = ?, recomendacion_mejora = ? WHERE id = ?';

  db.query(sql, [prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Hallazgo no encontrado' });
    res.json({ mensaje: 'Hallazgo actualizado exitosamente' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM hallazgos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Hallazgo no encontrado' });
    res.json({ mensaje: 'Hallazgo eliminado exitosamente' });
  });
});

module.exports = router;