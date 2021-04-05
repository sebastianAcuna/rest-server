const jwt = require('jsonwebtoken');
const {response, request} = require('express');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({msn:'No hay token en la peticion'})
    }

    try{

        const { uid } = jwt.verify(token, process.env.PUBLICORPUBLICKEY);
        const usuario = await Usuario.findById(uid);

        if( !usuario ){
            return res.status(400).json({msg:'Usuario no existe en bd'});   
        }

        if ( !usuario.estado ){
            return res.status(401).json({msg:'Token no valido.'})
        }

        request.usuario = usuario;

        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({msn:'token no valido'})
    }



}


module.exports = {
    validarJWT
}