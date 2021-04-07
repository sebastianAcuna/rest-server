
const role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');


const esRoleValido = async (rol = '') => {
    const existeRol = await role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
};


const correoExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`Este corre ( ${correo} ) ya se encuentra registrado`);
    }
}


const existeUsuarioPorId = async( id ) => {

    const existeUsuario = await Usuario.findById(id);

    if( !existeUsuario ){
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeCategoriaPorId = async( id ) => {

    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ){
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeProductoPorId = async( id ) => {

    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
        throw new Error(`El id no existe ${ id }`);
    }
}


const isValorNumerico = (numero = 0) => {
    console.log(numero);
    if(numero !== undefined){
        console.log("entro a undefined",numero);
        if(isNaN(numero)){
            console.log("no es numerico ",numero);
            throw new Error (`${numero} No es un numero.`);
        }else{
            console.log("es numerico ",numero);
        }
    }
    console.log(numero);

}

/*  validar colecciones permitidas  */
const coleccionesPermitidas = (coleccion  = '', colecciones = []) => {

    const incluida  = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error (`la ${coleccion} No es permitida, las permitidas son : [ ${colecciones} ].`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    correoExiste,
    existeUsuarioPorId,
    isValorNumerico,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}