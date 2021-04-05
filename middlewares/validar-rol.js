
const { request, response }  = require('express');


const esAdminRole = (req = request, res = response) => {

    try{
        if( !req.usuario ){ return res.status(401).json({
            msg:'Se quiere verificar el role sin autenticar el token primero'
        }) }


        const { role, nombre } = req.usuario;

        if( role !== 'ADMIN_ROLE'){
            return res.status(401).json({msg:`Usuario ${ nombre } no tiene los privilegios para realizar esta accion`});   
        }

        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({msn:'token no valido'})
    }
}

const tieneRol = ( ...roles ) => {
    return (req, res = response, next) => {

        if( !req.usuario ){ return res.status(401).json({
            msg:'Se quiere verificar el role sin autenticar el token primero'
        }) }
        
        const { role, nombre } = req.usuario;
        
        if( !roles.includes(role) ){
            return res.status(401).json({msg:`Usuario "${ nombre }" no tiene los permisos [${ roles }] para realizar esta accion `})
        }

        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRol
}