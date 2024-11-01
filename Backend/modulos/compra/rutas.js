const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();


router.get('/historial/:nombreCliente', async (req, res, next) => {
    try {
        const nombreCliente = req.params.nombreCliente;
        const historial = await controlador.historialComprasPorCliente(nombreCliente);
        respuesta.success(req, res, historial, 200);
    } catch (err) {
        next(err);
    }
});


router.get('/mes', async (req, res, next) => {
    try {
        const resultado = await controlador.comprasPorMes();
        res.status(200).json({
            error: false,
            status: 200,
            body: resultado,
        });
    } catch (err) {
        next(err);
    }
});


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
        const nuevaCompra = await controlador.agregar(req.body);  
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

async function sugerencias(req, res, next) {
    const { query } = req.params;
    try {
        // Realiza la consulta para encontrar placas que comiencen con el valor de `query`
        const resultados = await controlador.obtenerSugerenciasClientes(query);
        respuesta.success(req, res, resultados, 200);
    } catch (err) {
        console.error('Error al obtener sugerencias:', err);
        next(err);
    }
}

router.get('/sugerencias/:query', sugerencias);
router.get('/', todos);                 
router.get('/:id', uno);               
router.post('/', agregar);             
router.put('/:id', actualizar);        
router.delete('/:id', eliminar);


module.exports = router;
