var express = require('express');
var Medidas = require('../models/medidas');
var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();

// mustra todas las medidas

app.get('/', (req, res) => {
    Medidas.find({})
        .exec((err, medidas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                medidas: medidas
            });
        });

});

// Crear Nuevas Medidas

app.post('/', mdAautenticacion.verificaToken, (req, res) => {
    let body = req.body;

    let medida = new Medidas({
        proporcion: body.proporcion,
        nombre: body.nombre,
        precio: body.precio
    });

    medida.save((err, medidasDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear medidas',
                err: err
            })
        }
        if (!medidasDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear el producto'
            })
        }
        res.status(201).json({
            ok: true,
            medidas: medidasDB
        });
    })
});

module.exports = app;