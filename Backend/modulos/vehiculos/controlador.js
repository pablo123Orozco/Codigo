const TABLA = 'vehiculos';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); // Asegúrate de que esta ruta es correcta
    }

    // Obtener todos los vehículos
    async function todos() {
        return db.todos(TABLA); // Consulta para obtener todos los vehículos
    }

    // Obtener un vehículo por su ID
    async function uno(id) {
        return db.uno(TABLA, id); // Consulta para obtener un vehículo por su ID
    }

    // Agregar un nuevo vehículo
    async function agregar(body) {
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            historialReparaciones: body.historialReparaciones
        };

        return db.agregar(TABLA, vehiculo); // Insertar un nuevo vehículo
    }

    // Actualizar un vehículo existente
    async function actualizar(id, body) {
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            historialReparaciones: body.historialReparaciones
        };

        // Asegúrate de pasar `idvehiculo` correctamente para la actualización
        return db.actualizar(TABLA, id, vehiculo); // Usar el idvehiculo correctamente para actualizar el registro
    }

    // Eliminar un vehículo
    async function eliminar(id) {
        return db.eliminar(TABLA, id); // Eliminar un vehículo por ID
    }

    return {
        uno,
        todos,
        agregar,
        actualizar,
        eliminar
    };
};
