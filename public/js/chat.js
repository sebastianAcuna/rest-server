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


btnSalir.addEventListener('click', async (ev) => {
    ev.preventDefault();

    socket.disconnect();
    localStorage.removeItem('token');
    await validarJWT();

    
});


txtMensaje.addEventListener('keypress', (ev) => {

    // console.log(ev);
    if(ev.keyCode === 13){

        const uuid = textUid.value;
        const msg = ev.target.value;

        if( uuid ){

        }else{
            socket.emit('mensaje-general', msg);
        }

        ev.target.value = "";
    }
});


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

    
    socket.on('recibir-mensajes', dibujarMensajes );

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ()=> {

    });
    socket.on('mensaje-general', ()=> {

    });

}



const dibujarMensajes = ( chat  = [] ) => {


    let li  = ``;

    chat.forEach( ( { nombre, uid, mensaje } ) => {
        li += ` <li> 
                    <h6 class="text-success"> ${ nombre } <small style="font-size:12px;" class="text-muted"> ( ${ uid } ) </small>  </h6>
                    <span> ${mensaje} </span>  
                    <hr>
                </li>`;
    });

    ulMensajes.innerHTML = li;
}


const dibujarUsuarios  = ( usuarios = [] ) => {

    let li  = ``;

    usuarios.forEach( ( { nombre, uid } ) => {
        li += `<li> <p>  <h5 class="text-success"> ${ nombre }  </h5>    <span class="fs-6 text-muted"> ${ uid }  </span> </p></li>`;
        
    });

        ulUsuarios.innerHTML = li;

}

const main  = async () => {

    await validarJWT();
}

main();


