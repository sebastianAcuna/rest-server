
const { validationResult } = require('express-validator');


const validarCampos  = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();

}


const validarVieneArchiv = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg:"no hay archivo que subir"});
    }

    next();

}


module.exports = {
    validarCampos,
    validarVieneArchiv
}