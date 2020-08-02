const jwt = require('jsonwebtoken');

/*
    Esta función en lugar de devolver un valor o algo, devolverá una promesa ,porque nos permite manejar así el resolve y reject
*/

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        // Construimos el payload con la info que contiene el token y que es visible
        const payload = {
            uid,
            app: 'Prueba backend'
        };

        // El secret lo almacenamos en una variable de entorno y lo usamos aquí
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h',
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    })
}

module.exports = { generarJWT }