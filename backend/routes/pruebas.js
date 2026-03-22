const express = require('express');
const router = express.Router();
const db = require('../config/db');
const validators = require('../validators');

router.post('/', (req, res) => {
  const validation = validators.validatePrueba(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validación fallida', detalles: validation.errors });
  }

  const { producto, modulo_evaluado, objetivo } = req.body;
  const sql = 'INSERT INTO pruebas_usabilidad (producto, modulo_evaluado, objetivo) VALUES (?, ?, ?)';
  db.query(sql, [producto, modulo_evaluado, objetivo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Prueba guardada exitosamente' });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM pruebas_usabilidad', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pruebas_usabilidad WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Prueba no encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const validation = validators.validatePrueba(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Validación fallida', detalles: validation.errors });
  }

  const { id } = req.params;
  const { producto, modulo_evaluado, objetivo } = req.body;
  const sql = 'UPDATE pruebas_usabilidad SET producto = ?, modulo_evaluado = ?, objetivo = ? WHERE id = ?';

  db.query(sql, [producto, modulo_evaluado, objetivo, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Prueba no encontrada' });
    res.json({ mensaje: 'Prueba actualizada exitosamente' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pruebas_usabilidad WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Prueba no encontrada' });
    res.json({ mensaje: 'Prueba eliminada exitosamente' });
  });
});

module.exports = router;