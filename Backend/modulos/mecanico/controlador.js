const TABLA = 'mecanico';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); // Asegúrate de que esta ruta es correcta
    }

    // Obtener todos los mecánicos
    async function todos() {
        try {
            const resultados = await db.obtenerMecanicosConOrden();

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

    // Obtener un mecánico por su ID
    async function uno(id) {
        return db.uno(TABLA, id); // Consulta para obtener un mecánico por su ID
    }

    // Agregar un nuevo mecánico
    async function agregar(body) {
        const mecanico = {
            nombre: body.nombre,
            fecha: body.fecha,  // Formato 'YYYY-MM-DD'
            NoOrdenServicio: body.NoOrdenServicio  // Foránea que referencia a 'ordenesservicio'
        };

        return db.agregar(TABLA, mecanico); // Insertar un nuevo mecánico
    }

    // Actualizar un mecánico existente
    async function actualizar(id, body) {
        const mecanico = {
            nombre: body.nombre,
            fecha: body.fecha,
            NoOrdenServicio: body.NoOrdenServicio
        };

        return db.actualizar(TABLA, mecanico, { id: id }); // Actualizar un mecánico existente
    }

    // Eliminar un mecánico
    async function eliminar(id) {
        return db.eliminar(TABLA, id); // Eliminar un mecánico por ID
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
    };
};
