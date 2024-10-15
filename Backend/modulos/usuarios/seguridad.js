const auth = require("../autenticacion")

module.exports = function chequearAuth(){
    function middleware (req, res, next ){
        const id  = req.body.id;
         auth.chequearToken.confirmarToken(req, id)
         next();
    }
    return middleware
}