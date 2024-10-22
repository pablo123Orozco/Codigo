const TABLA = 'servicios';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); 
    }

    async function todos() {
        try {
            const resultados = await db.todos(TABLA);
            if (!resultados || resultados.length === 0) {
                return [];
            }
            return resultados; 
        } catch (error) {
            console.error('[error en todos()]', error); 
            throw new Error('Error al obtener los servicios: ' + error.message);
        }
    }

    async function uno(id) {
        return db.uno(TABLA, id); 
    }

    async function agregar(body) {
        const servicio = {
            servicio: body.servicio,
            costo_mano_obra: body.costo_mano_obra,
            precio_repuesto: body.precio_repuesto,
            precio_total: body.precio_total,
            descripcion: body.descripcion,
            orden_servicio_id: body.orden_servicio_id  // Asegúrate de recibir y pasar este valor
        };
        return db.agregar(TABLA, servicio);
    }

    async function actualizar(id, body) {
        const servicio = {
            servicio: body.servicio,
            costo_mano_obra: body.costo_mano_obra,
            precio_repuesto: body.precio_repuesto,
            precio_total: body.precio_total,
            descripcion: body.descripcion,
            orden_servicio_id: body.orden_servicio_id  // Incluir el ID de la orden de servicio
        };
        return db.actualizarServicio(TABLA, servicio, { id: id });
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
    };
};
