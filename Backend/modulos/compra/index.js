const db = require('../../src/DB/mysql');  // Revisa la ruta y asegúrate de que el archivo mysqlC existe
const ctrl = require('./controlador');

module.exports = ctrl(db);  // Inyectar la base de datos al controlador
