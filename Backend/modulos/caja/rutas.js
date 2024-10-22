const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

// Rutas para la caja

// Obtener todos los registros de la caja
router.get('/', todos);

// Obtener un registro de la caja por su ID
router.get('/:id', uno);

// Crear un nuevo registro en la caja
router.post('/', agregar);

// Registrar un ingreso en la caja
router.post('/ingreso', registrarIngreso);

// Registrar un egreso en la caja
router.post('/egreso', registrarEgreso);

// Actualizar un registro existente en la caja
router.put('/:id', actualizar);

// Eliminar un registro de la caja
router.delete('/:id', eliminar);

// Implementación de las funciones
async function todos(req, res, next) {
    try {
        const registros = await controlador.todos();
        respuesta.success(req, res, registros, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const registro = await controlador.uno(req.params.id);
        respuesta.success(req, res, registro, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const nuevoRegistro = await controlador.agregar(req.body);
        respuesta.success(req, res, 'Registro de caja creado con éxito', 201);
    } catch (err) {
        next(err);
    }
}

// Nueva ruta para registrar un ingreso en la caja
async function registrarIngreso(req, res, next) {
    try {
        const { idOrdenServicio, monto, concepto } = req.body;
        const nuevoIngreso = await controlador.registrarIngreso(idOrdenServicio, monto, concepto);
        respuesta.success(req, res, 'Ingreso registrado con éxito en la caja', 201);
    } catch (err) {
        next(err);
    }
}

// Nueva ruta para registrar un egreso en la caja
async function registrarEgreso(req, res, next) {
    try {
        const { idOrdenServicio, monto, concepto } = req.body;
        const nuevoEgreso = await controlador.registrarEgreso(idOrdenServicio, monto, concepto);
        respuesta.success(req, res, 'Egreso registrado con éxito en la caja', 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const registroActualizado = await controlador.actualizar(req.params.id, req.body);
        respuesta.success(req, res, 'Registro de caja actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Registro de caja eliminado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
