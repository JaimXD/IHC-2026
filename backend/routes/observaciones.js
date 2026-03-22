const express = require('express');
const router = express.Router();
const db = require('../config/db');
const validators = require('../validators');
const asyncHandler = require('../utils/asyncHandler');

// Crear una observación (POST)
router.post('/', asyncHandler((req, res, next) => {
  const validation = validators.validateObservacion(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta } = req.body;
  const sql = 'INSERT INTO observaciones (participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta], (err, result) => {
    if (err) return next(err);
    res.status(201).json({ id: result.insertId, mensaje: 'Observación guardada exitosamente' });
  });
}));

// Obtener todas las observaciones (GET)
router.get('/', asyncHandler((req, res, next) => {
  db.query('SELECT * FROM observaciones', (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
}));

router.get('/:id', asyncHandler((req, res, next) => {
  const { id } = req.params;
  db.query('SELECT * FROM observaciones WHERE id = ?', [id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json(results[0]);
  });
}));

router.put('/:id', asyncHandler((req, res, next) => {
  const validation = validators.validateObservacion(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { id } = req.params;
  const { participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta } = req.body;
  const sql = 'UPDATE observaciones SET participante_id = ?, tarea_id = ?, exito = ?, tiempo_segundos = ?, cantidad_errores = ?, comentarios = ?, problema_detectado = ?, severidad = ?, mejora_propuesta = ? WHERE id = ?';

  db.query(sql, [participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta, id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Observacion actualizada exitosamente' });
  });
}));

router.delete('/:id', asyncHandler((req, res, next) => {
  const { id } = req.params;
  db.query('DELETE FROM observaciones WHERE id = ?', [id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Observacion eliminada exitosamente' });
  });
}));

module.exports = router;