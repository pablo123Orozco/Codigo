const TABLA = 'ordenesservicio';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql');
    }

    // Obtener todas las órdenes de servicio junto con los vehículos asociados
    async function todos() {
        try {
            const resultados = await db.obtenerOrdenesConVehiculos();

            // Si no hay resultados, devolvemos un array vacío
            if (!resultados || resultados.length === 0) {
                return [];
            }

            return resultados;  // Devuelve los resultados correctamente
        } catch (error) {
            console.error('[error en todos()]', error); // Agregar un log para ver el error
            throw new Error('Error al obtener las órdenes de servicio: ' + error.message);
        }
    }

    // Obtener una orden de servicio por su ID
    async function uno(id) {
        try {
            const resultado = await db.uno(TABLA, id);

            // Verifica si el resultado es null o undefined
            if (!resultado) {
                throw new Error('No se encontró la orden de servicio con el ID especificado');
            }

            return resultado;
        } catch (error) {
            throw new Error('Error al obtener la orden de servicio');
        }
    }

    async function agregar(body) {
        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo, // Clave foránea a la tabla vehiculos
        };
        try {
            return await db.agregar(TABLA, orden);
        } catch (error) {
            console.error('[error en agregar()]', error);
            throw error;
        }
    }
    // Actualizar una orden de servicio existente
    async function actualizar(id, body) {
        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo
        };

        return db.actualizar(TABLA, id, orden);
    }

    // Eliminar una orden de servicio
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
