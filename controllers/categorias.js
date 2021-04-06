const { request, response } = require('express');
const { Categoria } = require('../models');


const obtenerCategorias = async (req = request, res = response) => {

    const { page = 0, limit = 5 } = req.query;


    if(isNaN( page ) || isNaN( limit )){
        return res.status(400).json({ msg:` pagina : ${page} y limite : ${ limit } deben ser valores numericos `});
    }

    const query = {
        estado : true
    }


    const [ total, categorias ] = await Promise.all([
         Categoria.countDocuments( query ),
         Categoria.find( query )
         .skip( Number( page ) )
         .limit( Number( limit ) )
         .populate( 'usuario', 'nombre' )
    ]);

    res.json({
        total,
        categorias
    })                                 

}

const obtenerCategoria  = async ( req = request, res = response ) => {
    const { id } = req.params;

    const categoria  = await Categoria.findById( id ).populate( 'usuario', 'nombre' );

    if(!categoria.estado){
       return  res.status(401).json({
            msg: `La categoria [ ${ categoria.nombre } ], se encuentra deshabilitada`
        })
    }

    res.json({
        categoria
    })

}



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

const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado ,usuario, ...resto }  = req.body;

    resto.usuario = req.usuario.id;
    resto.nombre = resto.nombre.toUpperCase();

    const categoria =  await Categoria.findByIdAndUpdate( id, resto, { new:true } );
    
    res.json({
        categoria
    })
}


const borrarCategoria  = async (req = request, res = response) => {

    const { id } = req.params;
    const data = { estado : false };
    const categoria  = await Categoria.findByIdAndUpdate( id, data );
    res.json({ categoria })


}

module.exports = { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria}