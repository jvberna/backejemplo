/*
Incluir módulo mongoose parac onectar a BD
*/
const mongoose = require('mongoose');

/*
Creamos función de conexión
asyng permite utilizar el await para que al conectar la función espere a que se haga el mongoose connect

Opcones de connect: https://mongoosejs.com/docs/connections.html
*/
const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CONLOCAL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }

}

/*
Exportar el método para que pueda ser utilizado desde el exterior
*/
module.exports = {
    dbConnection
}