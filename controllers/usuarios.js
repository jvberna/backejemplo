/*
Importamos response para poder usarlo y tipar la res de cualquier ruta, así podemos usar los métodos en VSC cuando escribimos res.
*/
const { response } = require('express');
/*
Importamos librería de cifrado
*/
const bcrypt = require('bcryptjs');
/*
Importamos nuestra librería para generar tokens
*/
const { generarJWT } = require('../helpers/jwt');
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
        uid: req.uid,
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
        usuario.password = bcrypt.hashSync(password, salt); // y aquí ciframos la contraseña

        // Guardamos en la BD, y devuleve una promesa y hay que espera a que termine para devolver el resultado, por lo que ponemos await delante
        // pana poner await hay que declarar la función crearUsuaruios como async
        await usuario.save();

        // Todo correcto, devolvemos el token del usuario
        // Generar token y devolver, es una promesa por lo que tenemso que esperar a que se resuelva
        const token = await generarJWT(usuario.uid);

        res.json({
            ok: true,
            usuario: usuario,
            token,
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


    // Obtener el ID que viene en la ruta
    const uid = req.params.id;
    // comprobar que el UID recibido tiene 12 caracteres para que pueda ser utilizado en al consulta findOne
    if (uid.length !== 24) {

        return res.status(404).json({
            ok: false,
            msg: 'UID invalido en URL',
        });
    }

    try {

        // Comprobar que el usuario existe en la BD
        const usuarioDB = await Usuario.findOne({ _id: uid });

        if (!usuarioDB) {
            return res.status(404).json({
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
        console.log('Backend Error: ', error);
        res.status(500).json({
            ok: false,
            error: 'Error inesperado',
        });

    }
}

// Borrar un usurio por ID
const borrarUsuario = async(req, res = response) => {

    // obtenemos el UID de los parametros que vienen por URL
    // siempre viene algo porque si no no se reconoce la ruta en el delete
    const uid = req.params.id;
    // comprobar que el UID recibido tiene 12 caracteres para que pueda ser utilizado en al consulta findOne
    if (uid.length !== 24) {

        return res.status(404).json({
            ok: false,
            msg: 'UID invalido en URL',
        });
    }
    // TODO: coprobar que tiene permisos
    try {

        // Comprobar que el usuario existe en la BD
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        // Construimos la sentencia de borrado usando el id recogido
        const usuarioBorrado = await Usuario.findByIdAndRemove(uid)

        // Devolvemos la operación
        res.json({
            ok: true,
            msg: 'Usuario borrado',
            borrado: usuarioBorrado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg: 'Error inesperado',
        })
    }

}

/*
Exportamos la función para que pueda ser utilizada fuera
*/
module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}