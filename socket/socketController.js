
const { Socket } = require('socket.io');
const { comprobarJWT } = require('../middlewares');
const { ChatMensajes } = require('../models')

const chatMensajes  = new ChatMensajes();

const socketController = async (socket = new Socket(), io ) => {


    console.log('cliente conectado', socket.id);

    const token  = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);
    if( !usuario ){
        return socket.disconnect();
    }

    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //conectarlo a una sala especial
    socket.join( usuario.id ); //global, socket.id, usuario.id





    socket.on('disconnect', ( ) => {

        chatMensajes.desconectarUsuario( usuario.id );
        console.log(` Cliente ${ socket.id } offline `);
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    })


    socket.on('mensaje-general', ( { msg, uuid } ) => {

        if( uuid ){

            socket.to( uuid ).emit('mensaje-privado', { de: usuario.nombre, msg } )

        }else{
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, msg );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        
        }

        
    });


    console.log(` se conecto ${usuario.nombre}`);


    // agregar al usuario conectado
    chatMensajes.conectarUsuario( usuario );

    io.emit('usuarios-activos', chatMensajes.usuariosArr );

}

module.exports = {
    socketController
}