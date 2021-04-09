const express = require('express')
const cors = require('cors');
const { dbConexion } = require('../database/config');
const fileUpload  = require('express-fileupload');
const { socketController } = require('../socket/socketController');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.server = require('http').createServer( this.app );

        this.io = require('socket.io')(this.server)


        this.rutas = {
            auth: '/api/auth',
            usuarios:'/api/usuarios',
            categorias:'/api/categorias',
            productos:'/api/productos',
            buscar:'/api/buscar',
            uploads:'/api/uploads',
        }


        // conectar a bd
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();

        //sockets
        this.sockets();
    }


    sockets(){
        this.io.on('connection', (socket) => socketController( socket, this.io ) );
    }


    async conectarDB (){
        await dbConexion();
    }


    middlewares(){
        
        //CORS para controlar que las peticiones sean de los dns que yo quiera
        this.app.use( cors() );


        // lectura y parseo del body
        this.app.use(express.json());


        //directorio publico
        this.app.use( express.static('public') );


        // file upload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }

    
    routes(){
        this.app.use(this.rutas.auth, require('../routes/auth'))
        this.app.use(this.rutas.usuarios, require('../routes/usuarios'))
        this.app.use(this.rutas.categorias, require('../routes/categorias'))
        this.app.use(this.rutas.productos, require('../routes/productos'))
        this.app.use(this.rutas.buscar, require('../routes/buscar'))
        this.app.use(this.rutas.uploads, require('../routes/uploads'))
        // this.app.use('/webserver', require('../../webserver').app)
    }


    listen(){
        this.server.listen(this.port, () =>{
            console.log('Servidor corriendo en : ', this.port);
        })
    }

}


module.exports = Server;