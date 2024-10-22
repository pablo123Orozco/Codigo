const TABLA = 'mecanico';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); 
    }

    
    async function todos() {
        try {
            const resultados = await db.todos(TABLA); // Asegúrate de pasar el nombre de la tabla 'mecanico'
        
            if (!resultados || resultados.length === 0) {
                return [];
            }
    
            return resultados; 
        } catch (error) {
            console.error('[error en todos()]', error); 
            throw new Error('Error al obtener las órdenes de servicio: ' + error.message);
        }
    }
    
    
    async function uno(id) {
        return db.uno(TABLA, id); 
    }

    
    async function agregar(body) {
        const mecanico = {
            nombre: body.nombre,
            fecha: body.fecha,  
        };

        return db.agregar(TABLA, mecanico); 
    }

    
    async function actualizar(id, body) {
        const mecanico = {
            nombre: body.nombre,
            fecha: body.fecha,
        };

        return db.actualizar(TABLA, mecanico, { id: id }); 
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
