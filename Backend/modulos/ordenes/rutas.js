const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

// Obtener todas las órdenes de servicio
router.get('/', todos);

// Obtener una orden de servicio por su ID
router.get('/:id', uno);

// Crear una nueva orden de servicio
router.post('/', agregar);

// Actualizar una orden de servicio existente
router.put('/:id', actualizar);

// Eliminar una orden de servicio
router.delete('/:id', eliminar);

async function uno(req, res, next) {
    try {
        const orden = await controlador.uno(req.params.id);
        if (!orden) {
            return respuesta.success(req, res, 'No se encontró la orden de servicio', 404);
        }
        respuesta.success(req, res, orden, 200);
    } catch (err) {
        next(err);
    }
}

async function todos(req, res, next) {
    try {
        const ordenes = await controlador.todos();
        if (!ordenes || ordenes.length === 0) {
            return respuesta.success(req, res, 'No se encontraron órdenes de servicio', 200);
        }
        respuesta.success(req, res, ordenes, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const nuevaOrden = await controlador.agregar(req.body); // Incluir los nuevos campos en el body
        respuesta.success(req, res, 'Orden de servicio creada con éxito', 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const ordenActualizada = await controlador.actualizar(req.params.id, req.body); // Incluir los nuevos campos en el body
        respuesta.success(req, res, 'Orden de servicio actualizada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Orden de servicio eliminada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
