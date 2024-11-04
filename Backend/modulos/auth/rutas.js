const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();

router.post('/login', login);

async function login(req, res, next) {
    try {
        // Llamada al controlador para obtener el token y el rol
        const { token, rol } = await controlador.login(req.body.usuario, req.body.contraseña);
        
        // Enviamos el token y el rol como respuesta al frontend
        respuesta.success(req, res, { token, rol }, 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
