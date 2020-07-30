require('dotenv').config()

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config')

// crear el servidor expres
const app = express();

//app.use(cors())

dbConnection();


console.log(process.env);


app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    });


});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});