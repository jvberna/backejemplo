const { Router } = require('express');
const { getUsuarios } = require('../controllers/usuarios');

const router = Router();

/*
Ruta Base: /api/usuarios
*/

router.get('/', getUsuarios);

/*
Exportamos el router para poder utilizarlo fuero
*/
module.exports = router;