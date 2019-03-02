var express = require('express');
var MP = require("mercadopago");
var mdAautenticacion = require('../middlewares/autenticacion');
var Venta = require('../models/venta');
var Status = require('../models/statusPago');
var mp = new MP("8793669845634348", "oxFiekcITZI2aS5BwnXgxMx3KsBAF7Cc");
var Carrito = require('../models/carritoCompras');
var DatosEnvio = require('../models/datosEnvio');
var CuadroCreado = require('../models/cuadroCreado');
var app = express();

app.post('/', mdAautenticacion.verificaToken, (req, res, ) => {
    var body = req.body;
    var precio = parseInt(body.precio);
    var date = new Date;
    dia = date.getDate();
    mesN = date.getMonth();
    arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    mes = arrayMeses[mesN];
    anio = date.getFullYear()
    fecha = anio + '/' + mes + '/' + dia;
    var venta = new Venta({
        usuario: body.usuario,
        monto: body.precio,
        fecha: fecha
    });

    venta.save((err, ventaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        var idVenta = ventaDB._id;
        Carrito.find({ $and: [{ usuario: body.usuario }, { Venta: 'sinID' }] })
            .exec((err, carrito) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                arrayCarritos = carrito;
                arrayCarritos.forEach((element) => {
                    element.Venta = idVenta;
                    element.save((err, carritoActualizado) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: "error al actualizar pago",
                                errors: err
                            });
                        }
                    });
                });
            });
        CuadroCreado.find({ $and: [{ usuario: body.usuario }, { Venta: 'sinID' }] })
            .exec((err, carritoCreado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                arrayCarritos = carritoCreado;
                arrayCarritos.forEach((element) => {
                    element.Venta = idVenta;
                    element.save((err, carritoActualizado) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: "error al actualizar pago",
                                errors: err
                            });
                        }
                    });
                });
            });
        DatosEnvio.find({ $and: [{ usuario: body.usuario }, { Venta: 'sinID' }] })
            .exec((err, envio) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                arrayDireccion = envio;
                arrayDireccion.forEach((element) => {
                    element.Venta = idVenta;
                    element.save((err, carritoActualizado) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: "error al actualizar pago",
                                errors: err
                            });
                        }
                    });
                });
            });
        var preference = {
            items: [{
                id: ventaDB._id,
                title: 'venta NO.' + ventaDB._id,
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
                    urlPago: resp.response.init_point,
                    idVenta: idVenta
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
    if (topic === 'payment') {
        mp.get('/v1/payments/' + id)
            .then(function(resp) {
                var ventasplit = resp.response.description;
                var arrayspit = ventasplit.split('.');
                var idVenta = arrayspit[arrayspit.length - 1];
                var status = resp.response.status;
                if (status === 'approved') {
                    Venta.findById(idVenta, (err, respVenta) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'no se encontro el producto en la base de datos',
                                err: err
                            })
                        }
                        respVenta.pagado = true;
                        respVenta.save((err, pagoActualizado) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: "error al actualizar pago",
                                    errors: err
                                });
                            }
                        })
                    })
                    status.save((err, statusDB) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'error al conectar con la base de datos',
                                err: err
                            })
                        }
                        return res.status(201).json({
                            ok: true,
                            mensaje: statusDB
                        });
                    })
                }
                status.save((err, statusDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'error al conectar con la base de datos',
                            err: err
                        })
                    }
                    return res.status(201).json({
                        ok: true,
                        mensaje: statusDB
                    })
                })
            }).catch(function(error) {
                res.status(400).json({
                    ok: false,
                    mensaje: error
                })
            });
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
    }
    if (topic === 'chargebacks') {
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
    }
    if (topic === 'merchant_order') {
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
    }
});

// obtiene compras por ID del cliente

app.get('/:id', mdAautenticacion.verificaToken, (req, res) => {
    id = req.params.id;
    Venta.find({ usuario: id })
        .exec((err, ventas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                ventas: ventas
            })
        });
});

// obtiene las ultimas compras

app.get('/admin', [mdAautenticacion.verificaToken, mdAautenticacion.verificaAdmin_ROLE], (req, res) => {

});
module.exports = app;