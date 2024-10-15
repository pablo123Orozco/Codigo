const app = require('./app');

app.listen(app.get('port'), () =>{
    console.log("Servidor esta levantado", app.get("port"));
})