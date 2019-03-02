var express = require('express');
var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();
var DatosEnvio = require('../models/datosEnvio');

app.post('/', mdAautenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var envio = new DatosEnvio({
        usuario: body.usuario,
        pais: body.pais,
        estado: body.estado,
        municipio: body.municipio,
        calle: body.calle,
        colonia: body.colonia,
        codigopostal: body.codigopostal,
        nombre: body.nombre,
        apeido: body.apeido,
        referencias: body.referencias,
        telefono: body.telefono
    });
    DatosEnvio.find({ $and: [{ usuario: body.usuario }, { Venta: 'sinID' }] })
        .exec((err, existe) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            if (existe == 0) {
                return envio.save((err, datosEnvio) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'error al conectar con la base de datos',
                            err: err
                        })
                    }
                    res.status(201).json({
                        ok: true,
                        datosEnvio: datosEnvio
                    });
                })
            }
            if (existe) {
                DatosEnvio.findById(existe[0]._id).exec((err, direccion) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'error al conectar con la base de datos',
                            err: err
                        })
                    }
                    direccion.pais = body.pais;
                    direccion.estado = body.estado;
                    direccion.municipio = body.municipio;
                    direccion.calle = body.calle;
                    direccion.colonia = body.colonia;
                    direccion.codigopostal = body.codigopostal;
                    direccion.nombre = body.nombre;
                    direccion.apeido = body.apeido;
                    direccion.referencias = body.referencias;
                    direccion.telefono = body.telefono
                    direccion.save((err, direccionActualizada) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'error al actualizar carrito',
                                err: err
                            })
                        }
                        return res.status(200).json({
                            ok: true,
                            datosEnvio: direccionActualizada

                        });
                    })
                });
            }

        });
});


// obtiene datos de envio por id de venta

app.get('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    DatosEnvio.find({ Venta: id }).exec((err, envioDB) => {
        res.status(200).json({
            ok: true,
            envio: envioDB[0]
        })
    })
});
module.exports = app;