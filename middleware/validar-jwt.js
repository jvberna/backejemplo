const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    // leemos el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta token de autorización'
        })
    }
    // Comprobar el token
    try {
        // Hacemos el verify sobre el token, si no es correcto por cualquier motivo saltaría al cach
        // si es correcto devuelve un objeto con el payload descifrado, se pueden desestructurar y sacar partes del payload para comprobar
        const { uid, ...objeto } = jwt.verify(token, process.env.JWT_SECRET);
        // Ahora podemos añadir en la request cosas, que se sumaran a lo que ya tenga la request, en este caso añadimos la UID con lo que luego
        // todo lo que se ejecute tendrá la request original más la UID
        req.uid = uid;
        // continuar con la siguiente
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
            help: error
        })
    }
}

module.exports = {
    validarJWT
}