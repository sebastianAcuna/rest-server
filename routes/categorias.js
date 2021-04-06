const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos } = require('../middlewares');
const { crearCategoria } = require('../controllers/categorias');

const router = Router();


router.get('/', () => {

})

router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es olbigatorio').not().isEmpty(),
    validarCampos
    
], crearCategoria)


module.exports = router;