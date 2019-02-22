var express = require('express');
var MP = require("mercadopago");
var mdAautenticacion = require('../middlewares/autenticacion');
var Venta = require('../models/venta');
var Status = require('../models/statusPago');
var mp = new MP("8793669845634348", "oxFiekcITZI2aS5BwnXgxMx3KsBAF7Cc");
var app = express();

app.post('/', mdAautenticacion.verificaToken, (req, res, ) => {
    var body = req.body;
    var precio = parseInt(body.precio);
    var venta = new Venta({
        usuario: body.usuario,
        monto: body.precio
    });

    venta.save((err, ventaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        var preference = {
            items: [{
                id: ventaDB._id,
                title: 'venta NO. ' + ventaDB._id,
                quantity: 1,
                currency_id: 'MXN',
                unit_price: precio
            }],
            payer: {
                name: body.nombre,
                surname: body.apeido,
                email: body.email,
            },
            shipments: {
                receiver_address: {
                    zip_code: body.codigopostal,
                    street_name: body.calle,
                }
            }
        };
        mp.preferences.create(preference)
            .then(function(resp) {
                res.status(201).json({
                    ok: true,
                    urlPago: resp.response.init_point
                })
            }).catch(function(error) {
                res.status(400).json({
                    ok: false,
                    mensaje: error
                })
            });
    })
});

app.post('/notificacion/', (req, res) => {
    let topic = req.query.topic;
    let id = req.query.id;
    status = new Status({
        topic: topic,
        idPago: id
    })
    status.save((err, statusDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        res.status(201).json({
            ok: true,
            mensaje: statusDB
        })
    })
});
module.exports = app;