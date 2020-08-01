/*
Modelo de mongoose para estructura la informaicón
*/
const { Schema, model } = require('mongoose');

/*
también se puede hacer la importanción como
    const mongoose = require('mongoose');
y el uso como
    mongoose.Schema...
*/

/*
Definición de la estructura de los registros de usuario
*/
const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'ALUMNO'
    },
});

/*
Exportamos el esquema como un modelo llamado Usurio
mediante el modelo sepueden hacer la soperaciones necesarias contra las coleciones

Mongoose los registros de este modelo los guardará sobre la coleción Usuarios, utiliza siempre el nombre del modelo + s al final
*/
module.exports = model('Usuario', UsuarioSchema);