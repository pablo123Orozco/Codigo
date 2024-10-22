const TABLA = 'compra';
const cajaControlador = require('../caja');  // Importamos el controlador de caja para manejar los egresos

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
        const compra = {
            nombreProducto: body.nombreProducto,
            fecha: body.fecha,
            total: body.total,
            estado: body.estado,
            idProveedor: body.idProveedor,
            idCliente: body.idCliente,
            marcha: body.marcha
        };

        try {
            const nuevaCompra = await db.agregar(TABLA, compra);

            // Registrar egreso en la caja por la compra
            await cajaControlador.registrarEgreso(nuevaCompra.insertId, body.total, 'Compra de producto');

            return nuevaCompra;
        } catch (error) {
            console.error('[error en agregar()]', error);
            throw error;
        }
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

        return db.actualizarCompra(id, compra);
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar
    };
};
