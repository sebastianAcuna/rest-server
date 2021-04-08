const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarJWT, validarCampos } = require('../middlewares')




const router = Router();



router.post('/login', [
    check('correo', 'El correo es obligatorio').notEmpty(),
    check('password', 'La contraseña es obligatoria ').not().isEmpty(),
    validarCampos
],login);
router.post('/google', [
    check('id_token', 'Falta el id_token').not().isEmpty(),
    validarCampos
],googleSignIn);


router.get('/', validarJWT, renovarToken);


module.exports = router;