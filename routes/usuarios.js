
const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios');

const { esRoleValido, correoExiste, existeUsuarioPorId, isNumerico } = require('../helpers/db-validators');
const {validarCampos, validarJWT, tieneRol} = require('../middlewares')

const router = Router();



router.get('/',  [
    // check('desde').custom( isNumerico ),
    // check('limite', 'Debe ser un numero').isNumeric(),
    // validarCampos
] ,usuariosGet);
router.post('/',[
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom( correoExiste ),
    check('nombre', 'el nombre es olbigatorio').notEmpty(),
    check('password', 'el password es olbigatorio y mas de 6 letras').isLength({min:6}),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( esRoleValido ),
    validarCampos
],usuariosPost);

router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);
router.patch('/', usuariosPatch);
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos

],usuariosDelete);


module.exports = router;