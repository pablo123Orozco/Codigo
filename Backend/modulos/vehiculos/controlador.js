const TABLA = 'vehiculos';

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
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            year: body.year,  // Se incluye el campo year
        };

        return db.agregar(TABLA, vehiculo); 
    }

    async function actualizar(id, body) {
        const vehiculo = {
            marca: body.marca,
            modelo: body.modelo,
            placa: body.placa,
            estadoActual: body.estadoActual,
            year: body.year,  // Se incluye el campo year
        };

        return db.actualizar(TABLA, id, vehiculo); 
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    async function obtenerSugerenciasPlacas(query) {
        const sql = 'SELECT placa FROM vehiculos WHERE placa LIKE ?';
        const values = [`${query}%`];
    
        try {
            // Si `db.conexion.query` devuelve una sola respuesta en lugar de un array, quita la desestructuración
            const resultados = await new Promise((resolve, reject) => {
                db.conexion.query(sql, values, (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                });
            });
    
            // Asegúrate de que `resultados` sea un array antes de iterar
            if (!Array.isArray(resultados)) {
                throw new Error("La respuesta de la base de datos no es un array");
            }
    
            // Devuelve solo las placas en un array simple
            return resultados.map(row => row.placa);
        } catch (error) {
            console.error('Error en obtenerSugerenciasPlacas:', error);
            throw error;
        }
    }

    
    
    return {
        uno,
        todos,
        agregar,
        actualizar,
        eliminar,
        obtenerSugerenciasPlacas
    };
};
