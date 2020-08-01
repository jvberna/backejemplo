const { Router } = require('express');
const { getUsuarios, crearUsuarios } = require('../controllers/usuarios');

const router = Router();

/*
Ruta Base: /api/usuarios
*/
// get / -> devolver todos los usuarios
router.get('/', getUsuarios);
// post / -> guardar un usuario
router.post('/', crearUsuarios);


/*
Exportamos el router para poder utilizarlo fuero
*/
module.exports = router;