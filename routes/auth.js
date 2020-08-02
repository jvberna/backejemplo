/*
Ruta Base: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const { login } = require('../controllers/auth');

const router = Router();


router.post(
    '/', [
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('email', 'El email es obligatorio y debe ser válido').isEmail(),
        validarCampos,
    ],
    login
)



module.exports = router;