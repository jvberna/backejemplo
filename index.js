/*
Incluimos el módulo dotenv que carga variables de entorno (el archivo .env)
automáticamente el método config() busca un archivo .env y carga las variables de entorno
*/
require('dotenv').config();

/*
Incluimos express
*/
const express = require('express');

/*
    Incluimos CORS
*/
const cors = require('cors')

/*
Inclumos el archivo config.js que se encarga de configurar la conexión a BD
*/
const { dbConnection } = require('./database/config')

/*
Crear el servidor expres
*/
const app = express();

/*
Añadimos CORS a express
*/
app.use(cors());
/*
Añadimos el módulo para lectura y pareo del body
*/
app.use(express.json());
/*
Conexión con BD
*/
dbConnection();

/*
Definimos las rutas
Cada ruta va a requerir lo que indique el correspondiente archivo de rutas, es decir, la respuesta la va a dar lo que está dentro del require
*/
app.use('/api/usuarios', require('./routes/usuarios'));


/*
    Abrimos el servidor para escuchar las rutas cargadas
*/
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});