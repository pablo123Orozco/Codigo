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
    
            // Verificar si la compra tiene relación con orden de servicio antes de registrar el egreso
            if (body.idOrdenServicio) {
                await cajaControlador.registrarEgreso(body.idOrdenServicio, body.total, 'Compra de producto');
            }
    
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

    
    async function historialComprasPorCliente(nombreCliente) {
        console.log("Buscando historial de compras para el cliente:", nombreCliente); // Para depuración
    
        const sql = `
            SELECT compra.*, clientes.nombre AS nombreCliente
            FROM compra
            JOIN clientes ON compra.idCliente = clientes.id
            WHERE clientes.nombre LIKE ?
        `;
    
        return new Promise((resolve, reject) => {
            db.conexion.query(sql, [`%${nombreCliente}%`], (error, result) => {
                if (error) {
                    console.error('[Error en la consulta]', error);
                    return reject(error);
                }
                console.log("Resultado de la consulta:", result); // Para verificar los resultados
                resolve(result);
            });
        });
    }
    
    async function comprasPorMes() {
        const sql = `
            SELECT 
                MONTH(fecha) AS mes, 
                COUNT(*) AS cantidad,
                SUM(total) AS totalCompras
            FROM 
                ${TABLA}
            WHERE 
                YEAR(fecha) = YEAR(CURDATE())
            GROUP BY 
                mes
            ORDER BY 
                mes;
        `;
        
        return new Promise((resolve, reject) => {
            db.conexion.query(sql, (error, results) => {
                if (error) {
                    console.error('[Error en comprasPorMes]', error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
        historialComprasPorCliente,
        comprasPorMes
    };
};
