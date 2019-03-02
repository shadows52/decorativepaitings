var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAautenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');


//obtener todos los usuarios
app.get('/', [mdAautenticacion.verificaToken, mdAautenticacion.verificaAdmin_ROLE], (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email img role', )
        .skip(desde)
        .limit(12)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    conteo: conteo
                });
            })
        });

});

//actualizar usuario

app.put('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                err: err
            })
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id' + id + 'no existe',
                err: { messaje: 'no existe un usuario con ese ID' }
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar usuario',
                    err: err
                })
            }
            usuarioActualizado.password = 'ella no te ama'
            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado

            });
        })

    })
})

//crear usuarios

app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apeido: body.apeido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    })
});


//borrar usuarios por el ID

app.delete('/:id', [mdAautenticacion.verificaToken, mdAautenticacion.verificaAdmin_ROLE], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el usuario',
                err: err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un usuario con ese id'
            })
        }
        usuarioBorrado.password = 'ella no te ama'
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

// buscar usuario

app.get('/buscar/:termino', [mdAautenticacion.verificaToken, mdAautenticacion.verificaAdmin_ROLE], (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    let termino = req.params.termino;
    var regex = new RegExp(termino, 'i');

    Usuario.find({ $or: [{ nombre: regex }, { email: regex }] })
        .skip(desde)
        .limit(12)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Usuario.count({ $or: [{ nombre: regex }, { email: regex }] }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    conteo: conteo,
                    busqueda: termino
                });
            })
        });
});

module.exports = app;