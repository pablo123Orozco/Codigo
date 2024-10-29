const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: 3306,
};

let conexion;

function conMysql() {
    conexion = mysql.createConnection(dbconfig);
    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql, 2000); // Intervalo para reintentar la conexión
        } else {
            console.log('bd conectada');
        }
    });

    conexion.on('error', (err) => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql(); 
        } else {
            throw err;
        }
    });
}

conMysql(); 

function obtenerOrdenes() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ordenesservicio.id AS numeroOrden,
                ordenesservicio.detalleReparacion, 
                ordenesservicio.costoEstimado, 
                ordenesservicio.estado,
                vehiculos.marca, 
                vehiculos.placa,
                clientes.nombre AS nombreCliente,
                mecanico.nombre AS nombreMecanico,
                ordenesservicio.estadoPago,
                ordenesservicio.tipoPago
            FROM ordenesservicio
            JOIN vehiculos ON ordenesservicio.idVehiculo = vehiculos.id
            JOIN clientes ON ordenesservicio.idCliente = clientes.id
            JOIN mecanico ON ordenesservicio.idMecanico = mecanico.id
        `;
        conexion.query(query, (error, result) => {
            if (error) {
                console.error('[error en la consulta]', error);
                return reject(error);
            }
            resolve(result);
        });
    });
}

function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function uno(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function agregar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, [data], (error, result) => {
            if (error) {
                console.error('[error en agregar]', error);
                return reject(error);
            }
            resolve(result);
        });
    });
}

function actualizar(tabla, id, data) {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = Object.values(data);
        values.push(id);

        conexion.query(`UPDATE ${tabla} SET ${fields} WHERE id = ?`, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

function eliminar(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function query(tabla, condiciones) {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(condiciones);
        const values = Object.values(condiciones);
        const conditionString = keys.map(key => `${key} = ?`).join(' AND ');

        const sql = `SELECT * FROM ${tabla} WHERE ${conditionString}`;
        
        conexion.query(sql, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result[0]);
        });
    });
}

async function actualizarCompra(id, compra) {
    const sql = `
        UPDATE compra 
        SET nombreProducto = ?, 
            fecha = ?, 
            total = ?, 
            estado = ?, 
            idProveedor = ?, 
            idCliente = ?, 
            marcha = ? 
        WHERE id = ?`;

    const valores = [
        compra.nombreProducto, 
        compra.fecha, 
        compra.total, 
        compra.estado, 
        compra.idProveedor, 
        compra.idCliente, 
        compra.marcha,
        id
    ];

    return new Promise((resolve, reject) => {
        conexion.query(sql, valores, (err, resultado) => {
            if (err) {
                reject(err);
            } else {
                resolve(resultado);
            }
        });
    });
}

function actualizarse(tabla, data, id) {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(data), id];

        conexion.query(`UPDATE ${tabla} SET ${fields} WHERE id = ?`, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

function uno2(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        });
    });
}

// Exporta `conexion` para permitir consultas personalizadas en otros módulos
module.exports = {
    conexion,
    todos,
    uno,
    agregar,
    actualizar,
    eliminar,
    query,
    obtenerOrdenes,
    actualizarCompra,
    actualizarse,
    uno2
};
