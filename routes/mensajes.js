var express = require('express');
var MensajeUsuario = require('../models/mensaje');
var app = express();

// crear mensaje

app.post('/', (req, res) => {
    let body = req.body;

    let mensaje = new MensajeUsuario({
        nombre: body.nombre,
        email: body.email,
        mensaje: body.mensaje,
        asunto: body.asunto,
    });

    mensaje.save((err, mensajeDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear Mensaje',
                err: err
            })
        }
        if (!mensajeDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear el mensaje'
            })
        }
        res.status(201).json({
            ok: true,
            mensajeDB: mensajeDB
        });
    })
});


module.exports = app;