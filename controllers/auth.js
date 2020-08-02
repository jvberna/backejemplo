// response para poder tipar la respuesta y así ver los métodos cuando la usamos
const resonse = require('express');
// la funcioón bcrypt para comprobar el pw
const bcrypt = require('bcryptjs');
// importamos el modelo para usar la BD
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

// función login de tipo async para hacer llamadas a la BD
const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Recuperamos el usuario de la BD que tiene ese email
        const usuarioDB = await Usuario.findOne({ email });
        // Si no existe error (no dar pistas en el mensaje de error sobre donde está el problema)
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos', // no poner email no válido porque si no ya das pistas de que el email no existe o si existe
            })
        }

        // verificar contraseña, compareSync comprueba si el password y el hash que hemos recuperado de la BD casan
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        // Si devuelve falso entonces error en el login (no dar pistas en el mensaje de error sobre dond eestá el problema)
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos'
            })
        }

        // Generar token y devolver, es una promesa por lo que tenemso que esperar a que se resuelva
        const token = await generarJWT(usuarioDB._id);

        res.json({
            ok: true,
            token: token,
            msg: 'Login correcto'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            help: error
        })
    }
}

// Exportamos el modulo para poder usarlo fuera (en el router auth)
module.exports = {
    login
};