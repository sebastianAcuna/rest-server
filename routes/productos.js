const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router = Router();


router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es olbigatorio').not().isEmpty(),
    check('categoria', 'la categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
    
], crearProductos)

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    check('categoria', 'la categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    validarJWT,
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    validarCampos
], borrarProducto)


module.exports = router;