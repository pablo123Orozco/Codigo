const TABLA = 'vehiculos';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); 
    }

    async function todos() {
        return db.todos(TABLA); 
    }

    async function uno(id) {
        return db.uno(TABLA, id);
    }

    async function agregar(body) {
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            year: body.year,  // Se incluye el campo year
        };

        return db.agregar(TABLA, vehiculo); 
    }

    async function actualizar(id, body) {
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            year: body.year,  // Se incluye el campo year
        };

        return db.actualizar(TABLA, id, vehiculo); 
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        uno,
        todos,
        agregar,
        actualizar,
        eliminar
    };
};
