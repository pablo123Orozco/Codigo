const TABLA = 'auth';  
const bcrypt = require('bcrypt');
const autenticacion = require('../autenticacion');

module.exports = function(dbinyectada) {
    
    let db = dbinyectada;
    if (!db){
        db = require('../../src/DB/mysql');
    }

    async function login(usuario, contraseña) {
        try {
            
            console.log(`Buscando usuario: ${usuario}`);
            const data = await db.query(TABLA, { usuario: usuario });
            console.log('Datos del usuario encontrado:', data);

            if (!data || !data.contraseña) {
                throw new Error('Información inválida');
            }

            
            const resultado = await bcrypt.compare(contraseña, data.contraseña);
            if (resultado === true) {
                return autenticacion.asignarToken({ ...data });
            } else {
                throw new Error('Información inválida');
            }
        } catch (error) {
            console.error('Error en login:', error.message);
            throw new Error('Información inválida');
        }
    }

    async function agregar(data) {
        console.log(data);
        const authData = {};

       
        if (data.id !== undefined && data.id !== null) {
            authData.id = data.id;  
        } else {
            throw new Error('ID no puede ser null o undefined');
        }

        if (data.usuario) {
            authData.usuario = data.usuario;
        }

        if (data.contraseña) {
            authData.contraseña = await bcrypt.hash(data.contraseña.toString(), 2);
        }

        return db.agregar(TABLA, authData);  // Insertar el registro en la tabla auth
    }

    return {
        agregar,
        login,
    };
};
