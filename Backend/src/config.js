require ('dotenv').config();
module.exports={
    app: {
        port: process.env.PORT || 4000,

    },

    jwt:{
        secret: process.env.JET_SECRET || 'notaSecreta'
    },

    mysql : {
        host:process.env.MYSQL_HOST || 'localhost',
        user:process.env.MYSQL_USER || 'root',
        password:process.env.MYSQL_PASSWORD || '',
        database:process.env.MYSQL_DATABASE || 'basefinal',
        port:process.env.MYSQL_PORT || 3306,
    }
}