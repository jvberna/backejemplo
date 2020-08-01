/*
Declaración de los controladores para cada ruta de Usuarios
*/

const getUsuarios = (req, res) => {
    res.json({
        ok: true,
        usuarios: []
    });
}



/*
Exportamos la función para que pueda ser utilizada fuera
*/
module.exports = { getUsuarios, }