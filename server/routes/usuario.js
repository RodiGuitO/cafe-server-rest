const express = require('express');

const app = express();

const _ = require('underscore');

let Usuario = require('../models/usuario');

let bcrypt = require('bcrypt');

app.get('/', function(req, res) {
    res.json('Server run');
});

// ======================================================================================
// Lista de usuarios usuario - limit 5
// ======================================================================================

// postman .../usuario/list?desde=5
app.get('/usuario/list', function(req, res) {
    // para skip
    var count = req.query.desde || 0,
        // hardcodear => obligar a un formato
        // @ts-ignore
        count = Number(count);

    // busqueda de usuario activos - > estado: true
    Usuario.find({ estado: true }, '_id nombre email img role google')
        .skip(count)
        .limit(5)
        .exec(
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error de lectura en BD',
                        error: error
                    });
                }

                if (result) {
                    Usuario.count({ estado: true }, (error, cantidadUser) => {
                        return res.status(200).json({
                            ok: true,
                            message: 'Lista de usuarios conformada',
                            usuarios: result,
                            count: cantidadUser
                        });
                    });
                }

            });
});

// ======================================================================================
// Ver usuario por id
// ======================================================================================

// get, post, put, delete, HTTP
app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        id,
        message: 'get user found'
    });
});

// ======================================================================================
// Crear usuario
// ======================================================================================

// crear usuario
app.post('/usuario', (req, res) => {
    let body = req.body;

    /*  if (!body.nombre || !body.password || !body.email) {
         res.status(400).json({
             ok: false,
             message: 'Post user: bad request'
         });
     } */

    // creo usuario
    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // guarda en mongodb
    user.save((error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                // @ts-ignore
                message: 'Error al registrar usuario: ' + user.nombre,
                error: error
            });
        }

        // alternativa de uso sin schema(delete password): userDB.password = ':)';

        return res.status(200).json({
            ok: true,
            // @ts-ignore
            message: `El usuario ${user.nombre} se registro correctamente.`,
            usuario: userDB
        });
    });
});

// ======================================================================================
// Actualizar usuario por id
// ======================================================================================

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    // body = req.body;
    // ej para borrar reg que no queremos actualizar
    // delete body.password;
    // delete body.google;

    // Otra forma usando underscore
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // guarda y actualiza la BD: 
    //(id, body: parametros actualizados,(Opts) new: muestra registros actualizados, callBacks)
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (error, userUp) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar usuario, id: ' + id,
                error: error
            });
        }

        return res.status(200).json({
            ok: true,
            message: `El usuario ${body.nombre} se actualizo correctamente.`,
            usuario: userUp
        });

    });
});

// ======================================================================================
// Set usuario Unactive en BD - Put
// ======================================================================================

app.put('/usuario/unactive/:id', (req, res) => {
    let id = req.params.id;

    let elemento = { estado: false };
    //(id, body: parametros actualizados,(Opts) new: muestra registros actualizados, callBacks)
    Usuario.findByIdAndUpdate(id, elemento, { new: true, context: 'query' }, (error, userUp) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar usuario, id: ' + id,
                error: error
            });
        }

        return res.status(200).json({
            ok: true,
            // @ts-ignore
            message: `El usuario ${userUp.email} esta incativo en BD.`,
            usuario: userUp
        });

    });
});

// ======================================================================================
// Set usuario Unactive en BD - Delete
// ======================================================================================

app.delete('/usuario/unactive/:id', (req, res) => {
    var id = req.params.id;

    Usuario.findById(id, (error, userToUnactive) => {
        // is null or not find
        if (!userToUnactive) {
            if (res.status(400) || res.status(404)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario: ' + id + ' no existe.',
                    error: error
                });
            }
        }

        // error de sistema
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error de lectura en BD',
                error: error
            });
        }

        // si lo encuentra lo desactivo
        // @ts-ignore
        userToUnactive.estado = false;

        userToUnactive.save((error, usuarioUnacticve) => {
            if (error) {
                // veo status de respuesta 400 ver pdf
                return res.status(400).json({
                    ok: false,
                    message: 'Error al guardar usuario en BD',
                    error: error
                });
            }

            // oculto pass para mostrar
            // @ts-ignore
            delete usuarioUnacticve.password;
            // veo status de respuesta 201 ver pdf
            // responde en formato JSON
            return res.status(201).json({
                ok: true,
                // @ts-ignore
                message: "Su cuenta &nbsp" + usuarioUnacticve.email.fontcolor("red") + "&nbspha sido desactivada en BD",
                result: usuarioUnacticve
                    // @ts-ignore para ver creador
                    // creator: req.usuario
            });
        });
    });
});

// ======================================================================================
// Borrar Usuario en BD
// ======================================================================================

app.delete('/usuario/:id', (req, res) => {
    var id = req.params.id;

    Usuario.findById(id, (error, userToDelete) => {
        // is null or not find
        if (!userToDelete) {
            if (res.status(400) || res.status(404)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario: ' + id + ' no existe.',
                    error: error
                });
            }
        }

        // error de sistema
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error de lectura en BD',
                error: error
            });
        }
        // si lo encuentro lo borro
        userToDelete.remove((error, userDelete) => {

            // error de sistema
            if (error) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error de lectura en BD',
                    error: error
                });
            }
            // procedo a borrar
            // encripto pass
            // @ts-ignore
            delete userDelete.password;
            // veo status de respuesta 201 ver pdf
            // responde en formato JSON
            return res.status(200).json({
                ok: true,
                // @ts-ignore
                message: `El usuario ${userDelete.email}fue eliminado de la BD`,
                result: userDelete
            });
        });
    });
});

module.exports = app;