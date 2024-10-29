const TABLA = 'caja';

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
        const caja = {
            concepto: body.concepto,
            monto: body.monto,
            tipo: body.tipo,
            fecha: body.fecha || new Date(),
        };

        return db.agregar(TABLA, caja);
    }

    async function registrarIngreso(idOrdenServicio, monto, concepto) {
        const ingreso = {
            concepto: concepto,
            monto: monto,
            tipo: 'Ingreso',
            fecha: new Date(),
            idOrdenServicio: idOrdenServicio
        };

        return db.agregar(TABLA, ingreso);
    }

    async function registrarEgreso(idOrdenServicio, monto, concepto) {
        // Verificar si el idOrdenServicio es válido o no
        const egreso = {
            concepto: concepto,
            monto: monto,
            tipo: 'Egreso',
            fecha: new Date(),
        };
    
        return db.agregar(TABLA, egreso);
    }
    

    async function actualizar(id, body) {
        const caja = {
            concepto: body.concepto,
            monto: body.monto,
            tipo: body.tipo,
            fecha: body.fecha || null,
        };

        return db.actualizar(TABLA, id, caja);
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        todos,
        uno,
        agregar,
        registrarIngreso,
        registrarEgreso,
        actualizar,
        eliminar
    };
};
