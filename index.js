// Incluimos el módulo dotenv que carga variables de entorno (el archivo .env)
// automáticamente el método config() busca un archivo .env y carga las variables de entorno
require('dotenv').config();
// Incluimos express
const express = require('express');
// Incluimos CORS
const cors = require('cors')
    // Inclumos el archivo config.js que se encarga de configurar la conexión a BD
const { dbConnection } = require('./database/config')

// crear el servidor expres
const app = express();

// Añadimos CORS a express
app.use(cors())
    // Conexión con BD
dbConnection();


/* 
Ejemplo de ruta / que devuelve un JSON con OK y Hola Mundo
Ruta --> '/'
Controlador --> (req, res) => {
                res.json({
                    ok: true,
                    msg: 'Hola mundo'
                })
*/
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});

/*
    Abrimos el servidor para escuchar las rutas cargadas
*/
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});