const db = require('../config/db');
const validators = require('../validators');

const buildPruebaParams = (body) => {
	const {
		producto,
		modulo_evaluado,
		objetivo,
		perfil_usuarios,
		metodo,
		fecha,
		lugar,
		duracion_minutos,
		instrucciones_inicio,
		preguntas_seguimiento,
		instrucciones_cierre
	} = body;

	return [
		producto,
		modulo_evaluado,
		objetivo,
		perfil_usuarios ?? null,
		metodo ?? null,
		fecha ?? null,
		lugar ?? null,
		duracion_minutos ?? null,
		instrucciones_inicio ?? null,
		preguntas_seguimiento ?? null,
		instrucciones_cierre ?? null
	];
};

const createPrueba = (req, res, next) => {
	const validation = validators.validatePrueba(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const sql = `
		INSERT INTO pruebas_usabilidad (
			producto,
			modulo_evaluado,
			objetivo,
			perfil_usuarios,
			metodo,
			fecha,
			lugar,
			duracion_minutos,
			instrucciones_inicio,
			preguntas_seguimiento,
			instrucciones_cierre
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	db.query(sql, buildPruebaParams(req.body), (err, result) => {
		if (err) return next(err);
		res.status(201).json({ id: result.insertId, mensaje: 'Prueba guardada exitosamente' });
	});
};

const getPruebas = (req, res, next) => {
	db.query('SELECT * FROM pruebas_usabilidad', (err, results) => {
		if (err) return next(err);
		res.json(results);
	});
};

const getPruebaById = (req, res, next) => {
	const { id } = req.params;
	db.query('SELECT * FROM pruebas_usabilidad WHERE id = ?', [id], (err, results) => {
		if (err) return next(err);
		if (results.length === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json(results[0]);
	});
};

const updatePrueba = (req, res, next) => {
	const validation = validators.validatePrueba(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const { id } = req.params;
	const sql = `
		UPDATE pruebas_usabilidad SET
			producto = ?,
			modulo_evaluado = ?,
			objetivo = ?,
			perfil_usuarios = ?,
			metodo = ?,
			fecha = ?,
			lugar = ?,
			duracion_minutos = ?,
			instrucciones_inicio = ?,
			preguntas_seguimiento = ?,
			instrucciones_cierre = ?
		WHERE id = ?
	`;

	db.query(sql, [...buildPruebaParams(req.body), id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Prueba actualizada exitosamente' });
	});
};

const deletePrueba = (req, res, next) => {
	const { id } = req.params;
	db.query('DELETE FROM pruebas_usabilidad WHERE id = ?', [id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Prueba eliminada exitosamente' });
	});
};

module.exports = {
	createPrueba,
	getPruebas,
	getPruebaById,
	updatePrueba,
	deletePrueba
};
