const db = require('../../src/DB/mysql');  
const ctrl = require('./controlador');

module.exports = ctrl(db);  
