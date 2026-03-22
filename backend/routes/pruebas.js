const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { producto, modulo_evaluado, objetivo } = req.body;
  const sql = 'INSERT INTO pruebas_usabilidad (producto, modulo_evaluado, objetivo) VALUES (?, ?, ?)';
  db.query(sql, [producto, modulo_evaluado, objetivo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Guardado' });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM pruebas_usabilidad', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;