const { request, response } = require('express');
const bcrypjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const usuariosGet = (req = request, res = response) => {
    const {q, nombre = 'No Name', apikey, page = 1, limit} = req.query;
    res.json({ 
        msg:'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
        
    });
}
const usuariosPost = async (req, res = response) => {


    
    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario( { nombre, correo, password, role } );

    // verificar si correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        return res.status(400).json({
            msg: 'Ese correo ya se encuentra registrado'
        });
    }

    //encriptar la contraseña 
    const salt = bcrypjs.genSaltSync();
    usuario.password = bcrypjs.hashSync(password, salt);

    //guardar en db 
    await usuario.save();

    res.json(
        { 
            msg:'Post API - Controlador', 
            usuario
        }
    );
}
const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    res.json({ 
        msg:'Put API - Controlador',
        id
    });
}
const usuariosPatch = (req, res = response) => {
    res.json({ msg:'Patch API - Controlador'});
}
const usuariosDelete = (req, res = response) => {
    res.json({ msg:'Delete API - Controlador'});
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}