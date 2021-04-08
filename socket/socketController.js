
const { comprobarJWT } = require('../middlewares');

const socketController = async (socket) => {

    console.log('cliente conectado', socket.id);

    const token  = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);
    if( !usuario ){
        return socket.disconnect();
    }

    console.log(` se conecto ${usuario.nombre}`);

}

module.exports = {
    socketController
}