const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();


router.get('/', todos);




router.post('/', agregar);


router.put('/:id', actualizar);


router.delete('/:id', eliminar);

async function uno(req, res, next) {
    try {
        console.log("ID recibido en uno:", req.params.id); // Log para verificar el ID
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
        const nuevaOrden = await controlador.agregar(req.body); 
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

router.get('/historial/:placa', async (req, res, next) => {
    try {
        const { placa } = req.params;
        const historial = await controlador.historialPorPlaca(placa);
        res.status(200).json(historial);
    } catch (err) {
        next(err);
    }
});

router.get('/estado', async (req, res, next) => {
    try {
        const resultado = await controlador.ordenesPorEstado();
        
        if (!resultado || resultado.length === 0) {
            // Verificación explícita para resultado vacío
            return res.status(404).json({
                error: true,
                status: 404,
                body: "No se encontraron registros de estado",
            });
        }
        
        res.status(200).json({
            error: false,
            status: 200,
            body: resultado,
        });
    } catch (err) {
        next(err);
    }
});
router.get('/servicios-mas-solicitados', async (req, res, next) => {
    try {
        const resultado = await controlador.serviciosMasSolicitados();
        res.status(200).json({
            error: false,
            status: 200,
            body: resultado,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', uno);



module.exports = router;
