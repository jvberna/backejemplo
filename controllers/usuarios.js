/*
Importamos response para poder usarlo y tipar la res de cualquier ruta, así podemos usar los métodos en VSC cuando escribimos res.
*/
const { response } = require('express');

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
    // extraermos de req.body los valores enviados
    const { nombre, apellidos, email, password } = req.body;



    if (!nombre) {
        return res.status(400).json({
            ok: false,
            msg: 'Falta el nombre'
        });
    }

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

/*
Exportamos la función para que pueda ser utilizada fuera
*/
module.exports = {
    getUsuarios,
    crearUsuarios,
}