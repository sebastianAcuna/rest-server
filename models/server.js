const express = require('express')
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }


    middlewares(){
        
        //CORS para controlar que las peticiones sean de los dns que yo quiera
        this.app.use( cors() );


        // lectura y parseo del body
        this.app.use(express.json());


        //directorio publico
        this.app.use( express.static('public') );
    }

    
    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }


    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en : ', this.port);
        })
    }

}


module.exports = Server;