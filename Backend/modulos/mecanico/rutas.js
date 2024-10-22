const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index'); 

const router = express.Router();


router.get('/', todos);               
router.get('/:id', uno);              
router.post('/', agregar);            
router.put('/:id', actualizar);       
router.delete('/:id', eliminar);      


async function uno(req, res, next) {
    try {
        const mecanico = await controlador.uno(req.params.id); 
        respuesta.success(req, res, mecanico, 200);
    } catch (err) {
        next(err);
    }
}

async function todos(req, res, next) {
    try {
        const mecanicos = await controlador.todos();  
        respuesta.success(req, res, mecanicos, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const nuevoMecanico = await controlador.agregar(req.body);
        respuesta.success(req, res, 'Mecánico creado con éxito', 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const mecanicoActualizado = await controlador.actualizar(req.params.id, req.body);
        respuesta.success(req, res, 'Mecánico actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Mecánico eliminado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
