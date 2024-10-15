const TABLA = 'compra';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql'); // Asegúrate de que esta ruta es correcta
    }

    // Obtener todas las compras
    async function todos() {
        return db.todos(TABLA);
    }

    // Obtener una compra por ID
    async function uno(id) {
        return db.uno(TABLA, id);
    }

    // Agregar una nueva compra
    async function agregar(body) {
        const compra = {
            nombreProducto: body.nombreProducto,
            fecha: body.fecha,  // Formato 'YYYY-MM-DD'
            total: body.total,
            estado: body.estado,
            idProveedor: body.idProveedor,  // Foránea
            idCliente: body.idCliente,      // Foránea
            marcha: body.marcha
        };

        return db.agregar(TABLA, compra); // Insertar una nueva compra
    }

    async function actualizar(id, body) {
        const compra = {
            nombreProducto: body.nombreProducto,
            fecha: body.fecha,
            total: body.total,
            estado: body.estado,
            idProveedor: body.idProveedor,
            idCliente: body.idCliente,
            marcha: body.marcha
        };
    
        return db.actualizarCompra(id, compra); // Llamada a la nueva función específica
    }
    

    // Eliminar una compra
    async function eliminar(id) {
        return db.eliminar(TABLA, id); // Eliminar una compra
    }

    // Exportar todas las funciones
    return {
        todos,
        uno,
        agregar, // Asegúrate de exportar la función agregar correctamente
        actualizar,
        eliminar,
    };
};
