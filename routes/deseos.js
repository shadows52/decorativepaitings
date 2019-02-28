var express = require('express');
var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();
var Deseos = require('../models/listaDeseos');

// muestra todas las listas de deseos

app.get('/', mdAautenticacion.verificaToken, (req, res) => {
    var body = req.body;
    Deseos.find({
            $and: [
                { usuario: body.usuario },
                { producto: body.producto }
            ]
        })
        .populate('producto', 'nombre img precio')
        .exec((err, deseos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                deseos: deseos
            });
        });
});

// muestra lista de deseos por id

app.get('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Deseos.findById(id)
        .populate('producto', 'nombre img precio')
        .exec((err, deseosUsuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                deseos: deseosUsuario
            });
        });
});

// muestra los productos de la lista de deseos de determinado usuario

app.get('/usuario/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Deseos.find({ usuario: id })
        .populate('producto', 'nombre img precio')
        .exec((err, deseos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                deseos: deseos
            });
        });
});

// crear lista de deseos por usuario

app.post('/', mdAautenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var deseos = new Deseos({
        usuario: body.usuario,
        producto: body.producto
    });
    Deseos.find({
        $and: [
            { usuario: body.usuario },
            { producto: body.producto }
        ]
    }).exec((err, existe) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        if (existe == 0) {
            return deseos.save((err, deseosDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                return res.status(201).json({
                    ok: true,
                    deseos: deseosDB
                });
            });
        }
        if (existe) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ya existe en tu lista de deseos',
                existe
            })
        }

    });
})


// borra un item de la lista de deseos

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Deseos.findByIdAndRemove(id, (err, deseosBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el carrito',
                err: err
            })
        }
        if (!deseosBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un carrito con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            deseos: deseosBorrado
        })
    })
})

module.exports = app;