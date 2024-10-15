const TABLA = 'clientes';

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
        const clienteData = {
            nombre: body.nombre,
            apellido: body.apellido,
            nit: body.nit,
            telefono: body.telefono,
            correo: body.correo,
            estadoCuenta: body.estadoCuenta,
        };

        return db.agregar(TABLA, clienteData);
    }

    // **Actualizar cliente usando el ID**
    function actualizar(id, body) {
        const clienteData = {
            nombre: body.nombre,
            apellido: body.apellido,
            nit: body.nit,
            telefono: body.telefono,
            correo: body.correo,
            estadoCuenta: body.estadoCuenta,
        };

        return db.actualizar(TABLA, id, clienteData);  // Pasamos el `id` y `clienteData` correctamente
    }

    // **Eliminar cliente usando el ID**
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
