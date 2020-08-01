/*
Importacioón del modelo Usuarios, se pone con la U mayuscula (recomendación) porque es una clase ya que tiene argumentos y métodos
*/
const Usuario = require('../models/usuarios');

/*
Declaración de los controladores para cada ruta de Usuarios
*/

// get /
const getUsuarios = (req, res) => {
    res.json({
        ok: true,
        msg: 'get Usuaurios'
    });
}

// post /
const crearUsuarios = async(req, res) => {
    // extraermos de req.body los valores enviados
    const { nombre, apellidos, email, password } = req.body;
    // creamos una instancia de la clase Usuario y le pasamos el req.body, y va a coger del req.body los campos que se llamen igual que los argumentos del modelo
    const usuario = new Usuario(req.body);
    // Guardamos en la BD, y devuleve una promesa y hay que espera a que termine para devolver el resultado, por lo que ponemos await delante
    // pana poner await hay que declarar la función crearUsuaruios como async
    await usuario.save();

    res.json({
        ok: true,
        usuario: usuario,
    });
}

/*
Exportamos la función para que pueda ser utilizada fuera
*/
module.exports = {
    getUsuarios,
    crearUsuarios,
}