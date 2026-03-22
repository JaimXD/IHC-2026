const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Crear una nueva tarea (POST)
router.post('/', (req, res) => {
  const { prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito } = req.body;
  const sql = 'INSERT INTO tareas (prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Tarea guardada' });
  });
});

// Obtener todas las tareas (GET)
router.get('/', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito } = req.body;
  const sql = 'UPDATE tareas SET prueba_id = ?, escenario = ?, resultado_esperado = ?, metrica_principal = ?, criterio_exito = ? WHERE id = ?';

  db.query(sql, [prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea actualizada exitosamente' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada exitosamente' });
  });
});

module.exports = router;