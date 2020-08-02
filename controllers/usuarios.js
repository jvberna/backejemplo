/*
Importamos response para poder usarlo y tipar la res de cualquier ruta, así podemos usar los métodos en VSC cuando escribimos res.
*/
const { response } = require('express');
/*
Importamos librería de cifrado
*/
const bcrypt = require('bcryptjs');

/*
Importacioón del modelo Usuarios, se pone con la U mayuscula (recomendación) porque es una clase ya que tiene argumentos y métodos
*/
const Usuario = require('../models/usuarios');

/*
Declaración de los controladores para cada ruta de Usuarios
*/

// get /
const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre apellidos email rol imagen');

    res.json({
        ok: true,
        usuarios
    });
}

// post /
const crearUsuarios = async(req, res = response) => {

    // extraermos de req.body los valores que necesitamos comprobar especialmente en código
    const { email, password } = req.body;

    // try/cach para capturar errores
    try {

        // Comprobar si ya existe un email en la BD
        const existeEmail = await Usuario.findOne({ email: email }); // Se puede abreviar Usuario.findOne({ email}); porque el nombre del campo se llama igual que la const email
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                ms: 'Email ya existe',
            });
        }

        // creamos una instancia de la clase Usuario y le pasamos el req.body, y va a coger del req.body los campos que se llamen igual que los argumentos del modelo
        // si viene algún campo que en el model no está delcarado lo ignora
        const usuario = new Usuario(req.body);

        // encriptar contraseña
        const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
        console.log(salt);
        usuario.password = bcrypt.hashSync(password, salt); // y aquí ciframos la contraseña


        // Guardamos en la BD, y devuleve una promesa y hay que espera a que termine para devolver el resultado, por lo que ponemos await delante
        // pana poner await hay que declarar la función crearUsuaruios como async

        await usuario.save();

        res.json({
            ok: true,
            usuario: usuario,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}


const actualizarUsuario = async(req, res = response) => {


    // TODO: validar que el token es válido y tiene permisos para hacer la operación

    // Obtener el ID que viene en la ruta
    const uid = req.params.id;

    try {


        // Comprobar que el usuario existe en la BD
        const usuarioDB = await Usuario.findOne({ _id: uid });
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }


        // De esta forma obtenemos campos sin el campos password
        const { password, email, ...campos } = req.body

        if (email !== usuarioDB.email) {
            // Comprobar si ya existe un email en la bd
            const existeEmail = await Usuario.findOne({ email }); // Se puede abreviar Usuario.findOne({ email}); porque el nombre del campo se llama igual que la const email
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    ms: 'Ya existe un usuario con ese email',
                });
            }
            // añadimos email porque es correcto y hay que guardarlo
            campos.email = email;
        }

        // actualizamos en la BD pasándo el UID y los campos a actualizar
        // la opcion new:true hace que devuelva el resigro que se a actualizado en la bD
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
        res.json({
            ok: true,
            usuario: usuarioActualizado,
            msg: 'Usuario actualizado'
        });

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            ok: false,
            error: 'Error inesperado'
        });

    }
}

/*
Exportamos la función para que pueda ser utilizada fuera
*/
module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario
}