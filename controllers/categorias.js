const { request, response, json } = require('express');
const { Categoria } = require('../models');

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriadb  = await Categoria.findOne({ nombre })

    if( categoriadb ){

        return res.status(400).json({
            msg:'el nombre de categoria ya existe'
        });

    }

    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria  = await new Categoria( data );
    //guardar db
    await categoria.save();


    res.status(201).json({
        categoria
    })

}


module.exports = { crearCategoria }