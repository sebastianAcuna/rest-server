const  path =  require('path');
const  fs =  require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL)
const { response, request } = require("express");
const { subirArchivo } =  require('../helpers');




const { Usuario, Producto } = require('../models')



const cargarArchivo = async (req = request, res = response) => {

    try {
        const nombre  = await subirArchivo(req.files, ['txt','md'], 'textos');

        res.json({ nombre });
   
    } catch (error) {
        res.status(400).json({ msg: error });
    }
    

}


const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;


    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un usuario con el id ${id} `})
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un producto con el id ${id} `})
            }
            break;
        default:
            return res.status(500).json({msg:'se me olvido validar esto'})
    }


    //;limpiar imagenes previas
    try {
        if( modelo.img ){
            //hay que borrar la imagen del servidor
            const pathImagen  = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if(fs.existsSync( pathImagen )){
                fs.unlinkSync( pathImagen );
            }
        }

        const nombre  = await subirArchivo( req.files, undefined, coleccion );

        modelo.img = nombre;
        await modelo.save();
    
        res.json({modelo})
    } catch ( error ) {
        res.status(500).json({ error })
    }

}


const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;


    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un usuario con el id ${id} `})
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un producto con el id ${id} `})
            }
            break;
        default:
            return res.status(500).json({msg:'se me olvido validar esto'})
    }


    //;limpiar imagenes previas
    try {
        if( modelo.img ){
            
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');

            cloudinary.uploader.destroy( public_id );
            
        }

        const { tempFilePath } = req.files.archivo;

        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );



        // cloudinary.uploader.upload( )

        // const nombre  = await subirArchivo( req.files, undefined, coleccion );

        modelo.img = secure_url;
        await modelo.save();
    
        res.json({modelo})
    } catch ( error ) {
        res.status(500).json({ error })
    }

}


const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;


    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un usuario con el id ${id} `})
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({ msg: `No existe un producto con el id ${id} `})
            }
            break;
        default:
            return res.status(500).json({msg:'se me olvido validar esto'})
    }


    //;limpiar imagenes previas
    try {
        if( modelo.img ){
            //hay que borrar la imagen del servidor
            const pathImagen  = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if(fs.existsSync( pathImagen )){
               return  res.sendFile( pathImagen );
            }
        }

    } catch ( error ) {
        return res.status(500).json({ error })
    }


    const pathImagen  = path.join( __dirname, '../assets','no-image.jpg' );
    res.sendFile( pathImagen );


}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}