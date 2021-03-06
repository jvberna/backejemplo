const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

/*
Ruta Base: /api/usuarios
*/
// get / -> devolver todos los usuarios
router.get(
    '/',
    validarJWT,
    getUsuarios
);

// post / -> crear usuario
router.post(
    '/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('email', 'El email es obligatorio y debe ser válido').isEmail(),
        validarCampos,
    ],
    crearUsuarios
);

// put /:id -> actualizar
router.put(
    '/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y debe ser válido').isEmail(),
        validarCampos,
    ],
    actualizarUsuario
)

// delete /:id -> actualizar
router.delete(
    '/:id',
    validarJWT,
    borrarUsuario
)



/*
Exportamos el router para poder utilizarlo fuero
*/
module.exports = router;