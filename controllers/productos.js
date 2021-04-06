const { request, response, json } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async (req = request, res = response) => {

    const { page = 0, limit = 5 } = req.query;


    if(isNaN( page ) || isNaN( limit )){
        return res.status(400).json({ msg:` pagina : ${page} y limite : ${ limit } deben ser valores numericos `});
    }

    const query = {
        estado : true
    }


    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
         .skip( Number( page ) )
         .limit( Number( limit ) )
         .populate( 'usuario', 'nombre' )
         .populate( 'categoria', 'nombre' )
    ]);

    res.json({
        total,
        productos
    })                                 

}


const obtenerProducto  = async ( req = request, res = response ) => {
    const { id } = req.params;

    const producto  = await Producto.findById( id ).populate( 'usuario', 'nombre' ).populate( 'categoria', 'nombre');

    if(!producto.estado){
       return  res.status(401).json({
            msg: `El producto [ ${ producto.nombre } ], se encuentra deshabilitado`
        })
    }

    res.json({
        producto
    })

}



const crearProductos = async (req = request, res = response) => {

    const { nombre, precio = 0, ...resto } = req.body;

    resto.nombre = nombre.toUpperCase();

    if(isNaN(precio)){
        return res.status(400).json({
            msg:'El precio debe ser un valor numerico'
        });
    }

    resto.precio = Number(precio);

    const productodb  = await Producto.findOne({ nombre })

    if( productodb ){
        return res.status(400).json({
            msg:'el nombre de el producto ya existe'
        });
    }

    resto.usuario =  req.usuario._id;

    const producto = await new Producto( resto );
    //guardar db
    await producto.save();

    res.status(201).json({
        producto
    })

}

const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado ,usuario, ...resto }  = req.body;

    resto.usuario = req.usuario.id;
    resto.nombre = resto.nombre.toUpperCase();

    const producto =  await Producto.findByIdAndUpdate( id, resto, { new:true } );
    
    res.json({
        producto
    })
}


const borrarProducto  = async (req = request, res = response) => {

    const { id } = req.params;
    const data = { estado : false };
    const producto  = await Producto.findByIdAndUpdate( id, data );
    res.json({ producto })


}

module.exports = { crearProductos, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto }