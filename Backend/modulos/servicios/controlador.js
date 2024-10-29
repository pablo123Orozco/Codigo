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
        };
        return db.actualizarse(TABLA, servicio, id); // ajustado para enviar solo los parámetros necesarios
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
