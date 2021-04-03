
const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const role = require('../models/role');
const router = Router();



router.get('/', usuariosGet);
router.post('/',[
    check('correo', 'el correo no es valido').isEmail(),
    check('nombre', 'el nombre es olbigatorio').notEmpty(),
    check('password', 'el password es olbigatorio y mas de 6 letras').isLength({min:6}),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( async (rol = '') => {
        const existeRol = await role.findOne({ rol });
        if(!existeRol){
            throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
        }
    }),
    validarCampos
],usuariosPost);
router.put('/:id', usuariosPut);
router.patch('/', usuariosPatch);
router.delete('/', usuariosDelete);


module.exports = router;