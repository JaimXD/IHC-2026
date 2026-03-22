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

module.exports = router;