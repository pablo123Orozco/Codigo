const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const app = express();

const clientes = require("../modulos/clientes/rutas");
const usuarios = require("../modulos/usuarios/rutas");
const proveedores = require("../modulos/proveedor/rutas");
const compras = require("../modulos/compra/rutas");
const mecanico = require ("../modulos/mecanico/rutas");
const vehiculos = require("../modulos/vehiculos/rutas");
const ordenes = require("../modulos/ordenes/rutas");
const auth = require("../modulos/auth/rutas");
const servicios = require("../modulos/servicios/rutas"); 
const caja = require("../modulos/caja/rutas");  // <-- Nueva ruta para caja
const error = require('../src/red/errors');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.set('port', config.app.port);

app.use('/api/clientes', clientes);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/proveedor', proveedores);
app.use('/api/compras', compras);
app.use('/api/mecanico', mecanico);
app.use('/api/vehiculos', vehiculos);
app.use('/api/ordenes', ordenes);
app.use('/api/servicios', servicios); 
app.use('/api/caja', caja);  // <-- Nueva ruta de caja

// Middleware de manejo de errores
app.use(error);

module.exports = app;
