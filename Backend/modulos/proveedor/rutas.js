const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/:id', actualizar); // Se asegura de que el ID venga de la URL
router.delete('/:id', eliminar); // Se asegura de que el ID venga de la URL

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        const mensaje = 'Proveedor guardado con éxito';
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const id = req.params.id; // Obtener el ID desde los parámetros de la URL
        const items = await controlador.actualizar(id, req.body);  // Pasar el ID y los datos del body
        respuesta.success(req, res, 'Proveedor actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const id = req.params.id;  // Obtener el ID desde los parámetros de la URL
        await controlador.eliminar(id);  // Eliminar el proveedor por ID
        respuesta.success(req, res, 'Proveedor eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
