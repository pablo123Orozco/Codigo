const TABLA = 'proveedores';

module.exports = function(dbinyectada) {
    let db = dbinyectada;

    if (!db) {
        db = require('../../src/DB/mysql');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function uno(id) {
        return db.uno(TABLA, id);
    }

    function agregar(body) {
        const proveedorData = {
            nombre: body.nombre,
            nit: body.nit,
            dpi: body.dpi,
            razonSocial: body.razonSocial,
            telefono: body.telefono,
        };
        return db.agregar(TABLA, proveedorData);
    }

    function actualizar(id, body) {
        const proveedorData = {
            nombre: body.nombre,
            nit: body.nit,
            razonSocial: body.razonSocial,
            telefono: body.telefono,
        };
        return db.actualizar(TABLA, id, proveedorData);
    }

    function eliminar(id) {
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
