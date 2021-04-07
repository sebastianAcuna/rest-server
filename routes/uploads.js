const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarVieneArchiv } = require('../middlewares/validar-campos');




const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'el id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagen)

router.post('/',validarVieneArchiv, cargarArchivo);

router.put('/:coleccion/:id', [

    check('id', 'el id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarVieneArchiv,
    validarCampos

], actualizarImagenCloudinary);


module.exports = router;