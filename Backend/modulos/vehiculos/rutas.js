const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');  

const router = express.Router();

// Rutas correctas
router.get('/', todos);  // Cambia 'uno' por 'todos' para obtener todos los vehículos
router.get('/:id', uno);  // Obtener un vehículo por ID
router.post('/', agregar);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

// Funciones asociadas a las rutas

// Obtener todos los vehículos
async function todos(req, res, next) {
    try {
        const vehiculos = await controlador.todos();  // Devuelve todos los vehículos
        respuesta.success(req, res, vehiculos, 200);
    } catch (err) {
        next(err);
    }
}

// Obtener un vehículo por su ID
async function uno(req, res, next) {
    try {
        const vehiculo = await controlador.uno(req.params.id);  // Usa el parámetro `id`
        respuesta.success(req, res, vehiculo, 200);
    } catch (err) {
        next(err);
    }
}

// Agregar un vehículo
async function agregar(req, res, next) {
    try {
        const nuevoVehiculo = await controlador.agregar(req.body);
        respuesta.success(req, res, 'Vehículo creado con éxito', 201);
    } catch (err) {
        next(err);
    }
}

// Actualizar un vehículo
async function actualizar(req, res, next) {
    try {
        const vehiculoActualizado = await controlador.actualizar(req.params.id, req.body);
        respuesta.success(req, res, 'Vehículo actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

// Eliminar un vehículo
async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Vehículo eliminado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
