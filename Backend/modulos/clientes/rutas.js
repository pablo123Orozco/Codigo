const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/:id', actualizar);  
router.delete('/:id', eliminar);

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
        const mensaje = 'Cliente guardado con éxito';
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
}

// **Actualizar cliente usando el ID desde la URL**
async function actualizar(req, res, next) {
    try {
        const id = req.params.id;  // Captura el ID desde la URL
        const items = await controlador.actualizar(id, req.body);  // Llama a la función con el ID
        respuesta.success(req, res, 'Cliente actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}


async function eliminar(req, res, next) {
    try {
        const id = req.params.id;  // Captura el ID desde la URL
        await controlador.eliminar(id);
        respuesta.success(req, res, 'Cliente eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
