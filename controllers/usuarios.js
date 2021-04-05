const { request, response } = require('express');
const bcrypjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const usuariosGet = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;

    const query  = { estado : true};


    const [ total, usuarios ] = await  Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
        .skip( Number( desde ) )
        .limit( Number( limite ) )
    ]);

    res.json({ 
        total,
        usuarios
    });
}
const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario( { nombre, correo, password, role } );

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
const usuariosPut = async (req, res = response) => {
    const {id} = req.params;
    const { _id, password, google, correo,  ...resto } = req.body;

    //TODO validar contra bd

    if( password ){

        //encriptar la contraseña 
        const salt = bcrypjs.genSaltSync();
        resto.password = bcrypjs.hashSync(password, salt);

    }


    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
}
const usuariosPatch = (req, res = response) => {
    res.json({ msg:'Patch API - Controlador'});
}
const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;

    const usuarioAutotenticado = req.usuario;
    //fisicamente lo borramos
    // const usuario  = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id , { estado : false } );


    res.json({ usuario, usuarioAutotenticado});
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}