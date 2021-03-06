const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();


router.get('/', obtenerCategorias)
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria)

router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es olbigatorio').not().isEmpty(),
    validarCampos
    
], crearCategoria)

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos
], actualizarCategoria)

router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    validarCampos
], borrarCategoria)


module.exports = router;