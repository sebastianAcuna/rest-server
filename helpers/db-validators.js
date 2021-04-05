
const role = require('../models/role');
const Usuario = require('../models/usuario');

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


const isNumerico = (number) => {

    if(number !== undefined){
        console.log('number', number)
        if(isNaN(number)){
            console.log("no es numero")
            throw new Error (`${number} No es un numero.`);
        }
    }
    
}

module.exports = {
    esRoleValido,
    correoExiste,
    existeUsuarioPorId,
    isNumerico
}