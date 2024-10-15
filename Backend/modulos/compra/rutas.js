const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

// Rutas CRUD para la tabla compra
router.get('/', todos);                 // Obtener todas las compras
router.get('/:id', uno);                // Obtener una compra por ID
router.post('/', agregar);              // Crear una nueva compra
router.put('/:id', actualizar);         // Actualizar una compra existente
router.delete('/:id', eliminar);        // Eliminar una compra

// Funciones asociadas a las rutas
async function todos(req, res, next) {
    try {
        const compras = await controlador.todos();
        respuesta.success(req, res, compras, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const compra = await controlador.uno(req.params.id);
        respuesta.success(req, res, compra, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const nuevaCompra = await controlador.agregar(req.body);  // Llamar correctamente a la función agregar
        respuesta.success(req, res, 'Compra creada con éxito', 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const compraActualizada = await controlador.actualizar(req.params.id, req.body);
        respuesta.success(req, res, 'Compra actualizada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Compra eliminada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
