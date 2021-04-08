const url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8081/api/auth/'
: '';

let usuario  = null;
let socket  = null;


//referencias html
const textUid = document.querySelector("#textUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
    // validar el token del local storage
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ){
        window.location = './index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers:{ 'x-token':token }
    } );


    const { usuario:usuarioDb, token:tokenDb } = await resp.json();
    localStorage.setItem('token', tokenDb);

    usuario  = usuarioDb;

    await conectarSocket();
}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token':localStorage.getItem('token')
        }
    });


    socket.on('connect', () => {
        console.log('Sockets online');
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    })

}

const main  = async () => {

    await validarJWT();
}

main();


