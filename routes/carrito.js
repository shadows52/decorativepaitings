var express = require('express');
var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();
var Carrito = require('../models/carritoCompras');

// muestra todos los carritos de compra

app.get('/', mdAautenticacion.verificaToken, (req, res) => {

    Carrito.find({})
        .exec((err, carritos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                carritos: carritos
            });
        });

});

// muestra el carrito de compra por id

app.get('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Carrito.findById(id)
        .populate('producto', 'nombre img precio')
        .exec((err, carritoUsuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                carritos: carritoUsuario
            });
        });
});

// muestra los productos del carrito de compra de determinado usuario

app.get('/usuario/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Carrito.find({ $and: [{ usuario: id }, { Venta: 'sinID' }] })
        .populate('producto', 'nombre img precio')
        .exec((err, carrito) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                carrito: carrito
            });
        });
});

// mostrar productos por ID venta

app.get('/idventa/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id
    Carrito.find({ Venta: id })
        .populate('producto', 'img nombre')
        .exec((err, carritoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                carrito: carritoDB
            })
        })
});


// crear carrito de compras por usuario

app.post('/', mdAautenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var carrito = new Carrito({
        usuario: body.usuario,
        producto: body.producto,
        cantidad: body.cantidad
    });
    Carrito.find({
        $and: [
            { usuario: body.usuario },
            { producto: body.producto },
            { Venta: 'sinID' }
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
            return carrito.save((err, carritoDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                res.status(201).json({
                    ok: true,
                    carrito: carritoDB
                });
            })
        }
        if (existe) {
            return res.status(400).json({
                ok: false,
                mensaje: 'si deseas agregar mas unidades ve a tu carrito de compras',
                existe
            })
        }

    });
});

// actualizar carrito 

app.put('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Carrito.findById(id)
        .populate('productos', 'nombre')
        .exec((err, carrito) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            carrito.cantidad = body.cantidad
            carrito.save((err, carritoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar carrito',
                        err: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    carrito: carritoActualizado

                });
            })
        });
})

// borra un item del carrito de compras

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Carrito.findByIdAndRemove(id, (err, carritoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el carrito',
                err: err
            })
        }
        if (!carritoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un carrito con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            carrito: carritoBorrado
        })
    })
})


module.exports = app;