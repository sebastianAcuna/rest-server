const { response } = require('express');
const bcrypjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login  = async (req, res = response) => {
    const {correo, password} = req.body;



    try{

        //verificar si el email existe, 

        const usuario  = await Usuario.findOne( { correo } );
        if( !usuario ){
            return res.status(400).json({
                msg:'Usuario / Contraseña no son correctos - correo '
            })
        }

        //verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Usuario / Contraseña no son correctos - estado: false '
            })
        }
        
        //verificar la contrasena
        const validPassword = bcrypjs.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
                msg:'Usuario / Contraseña no son correctos - password '
            })
        } 
        //generar el jwt

        const token  = await generarJWT(usuario.id);

        res.json({usuario, token })

    }catch(err){
        console.log(err);
        res.status(500).json({msg: `Ocurrio un problema [${err}]. Hable con el administrador`})
    }

}


const googleSignIn  = async (req, res = response) => {

    try {
        const { id_token } = req.body;

        const { correo, nombre, img } = await googleVerify( id_token );

        //generar referencia para saber si existe correo
        let usuario = await Usuario.findOne( { correo } );
        if(!usuario){
            //tengo que crearlo
            const data  = {
                nombre,
                correo,
                password : ':p',
                img,
                google:true
            }
            usuario = new Usuario( data );
            await usuario.save();
        }

        // si el estado es falso
        if( !usuario.estado ){

            res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });

        }

        //generar el JWT
        const token  = await generarJWT( usuario.id );
        res.json({ usuario, token } );
        
    } catch (error) {
        res.status(400).json({msg:`Token de google no es valido error : ${error}`});

    }
    
}


module.exports = {
    login,
    googleSignIn
}