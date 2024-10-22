const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();


router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/:id', actualizar);
router.delete('/', eliminar);


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
        const mensaje = 'Usuario creado con éxito';
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
}


async function actualizar(req, res, next) {
    try {
        const items = await controlador.actualizar(req.params.id, req.body);
        const mensaje = 'Usuario actualizado con éxito';
        respuesta.success(req, res, mensaje, 200);
    } catch (err) {
        next(err);
    }
}


async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Usuario eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
