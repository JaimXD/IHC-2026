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

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM participantes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Participante no encontrado' });
    res.json(results[0]);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, perfil } = req.body;
  const sql = 'UPDATE participantes SET nombre = ?, perfil = ? WHERE id = ?';

  db.query(sql, [nombre, perfil, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Participante no encontrado' });
    res.json({ mensaje: 'Participante actualizado exitosamente' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM participantes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Participante no encontrado' });
    res.json({ mensaje: 'Participante eliminado exitosamente' });
  });
});

module.exports = router;