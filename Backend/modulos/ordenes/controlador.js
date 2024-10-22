const TABLA = 'ordenesservicio';
const cajaControlador = require('../caja');  // Importamos el controlador de caja para manejar los ingresos

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql');
    }

    async function todos() {
        try {
            const resultados = await db.obtenerOrdenes();
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
        try {
            const resultado = await db.uno(TABLA, id);
            if (!resultado) {
                throw new Error('No se encontró la orden de servicio con el ID especificado');
            }
            return resultado;
        } catch (error) {
            throw new Error('Error al obtener la orden de servicio');
        }
    }

    async function agregar(body) {
        console.log('Request body:', body);  // Para depuración
    
        // Validamos y convertimos los valores
        const idMecanico = parseInt(body.idMecanico, 10);
        const idServicio = parseInt(body.idServicio, 10);
    
        // Verificar si los valores son válidos
        if (isNaN(idMecanico)) {
            console.error('ID de mecánico inválido:', body.idMecanico);
            throw new Error('El ID del mecánico no es válido: ' + body.idMecanico);
        }
    
        if (isNaN(idServicio)) {
            console.error('ID de servicio inválido:', body.idServicio);
            throw new Error('El ID del servicio no es válido: ' + body.idServicio);
        }
    
        // Construcción del objeto de la orden
        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo,
            idCliente: body.idCliente,
            idMecanico: idMecanico,  // ID de mecánico validado
            concepto: body.concepto,
            combustible: body.combustible,
            servicio_id: idServicio,  // ID de servicio validado
            fechaIngreso: body.fechaIngreso || new Date(),  // Añadimos la fecha de ingreso
            tipoPago: body.tipoPago,
            estadoPago: body.estadoPago,
            adelantoEmpresa: body.adelantoEmpresa || 0
        };
    
        // Intentamos agregar la orden a la base de datos
        try {
            return await db.agregar(TABLA, orden);
        } catch (error) {
            console.error('[error en agregar()]', error);
            throw error;
        }
    }

    async function actualizar(id, body) {
        const idMecanico = parseInt(body.idMecanico, 10);
        const idServicio = parseInt(body.idServicio, 10);  // Convertimos idServicio a número

        if (isNaN(idMecanico) || isNaN(idServicio)) {
            throw new Error('El ID del mecánico o del servicio no es válido');
        }

        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo,
            idCliente: body.idCliente,
            idMecanico: idMecanico,
            concepto: body.concepto,
            combustible: body.combustible,
            servicio_id: idServicio,
            fechaIngreso: body.fechaIngreso,  // Actualizamos la fecha de ingreso
            tipoPago: body.tipoPago,  // Actualizamos el tipo de pago
            estadoPago: body.estadoPago,  // Actualizamos el estado del pago
            adelantoEmpresa: body.adelantoEmpresa  // Actualizamos el adelanto de la empresa
        };

        const resultado = await db.actualizar(TABLA, id, orden);

        // Registrar ingreso en la caja si el pago se ha completado y no se había registrado antes
        if (body.estadoPago === 'Pagado') {
            await cajaControlador.registrarIngreso(id, body.costoEstimado, 'Pago por orden de servicio');
        }

        return resultado;
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        uno,
        todos,
        agregar,
        actualizar,
        eliminar
    };
};
