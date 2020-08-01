const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, crearUsuarios } = require('../controllers/usuarios');

const router = Router();

/*
Ruta Base: /api/usuarios
*/
// get / -> devolver todos los usuarios
router.get('/', getUsuarios);

// post / -> guardar un usuario
router.post(
    '/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    ],
    crearUsuarios);


/*
Exportamos el router para poder utilizarlo fuero
*/
module.exports = router;