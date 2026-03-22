const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Crear un participante (POST)
router.post('/', (req, res) => {
  const { nombre, perfil } = req.body;
  const sql = 'INSERT INTO participantes (nombre, perfil) VALUES (?, ?)';
  
  db.query(sql, [nombre, perfil], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Participante guardado' });
  });
});

// Obtener todos los participantes (GET)
router.get('/', (req, res) => {
  db.query('SELECT * FROM participantes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;