var express = require('express');

var mdAautenticacion = require('../middlewares/autenticacion');

var app = express();

var Producto = require('../models/producto');

// obtener productos al azar

app.get('/aleatorio/', (req, res) => {
    var N = Producto.count();
    var R = Math.random();

    Producto.find({ random: { $gte: R } })
        .sort({ random: 1 })
        .limit(4)
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                producto: producto,
            });
        });

});

// obtiene productos por etiquetas

app.get('/etiquetas/:id', (req, res) => {
    let id = req.params.id;
    var ArrayEtiqueta;
    Producto.findById(id, (err, productoId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se encontro el producto en la base de datos',
                err,
                err
            })
        }
        var etiquetas = productoId.etiquetas;
        ArrayEtiqueta = etiquetas.split(',');
        var arrayRegex = [];
        ArrayEtiqueta.forEach(function(element) {
            arrayRegex.push(new RegExp(element));
        });
        Producto.find({ etiquetas: { $in: arrayRegex } })
            .limit(5).skip(1)
            .exec((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al conectar con la base de datos',
                        err: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    producto: producto
                });
            });
    });
});
// mostrar productos pagina principal

app.get('/principal', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ principal: true })
        .skip(desde)
        .limit(12)
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Producto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    producto: producto,
                    conteo: conteo
                });
            })
        });
});


// mostrar producto por ID

app.get('/id/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se encontro el producto en la base de datos',
                err: err
            })
        }
        res.status(200).json({
            ok: true,
            producto: productoId
        });
    })

});


// mustra todas los productos

app.get('/', (req, res) => {
    Producto.find({})
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                producto: producto
            });
        });

});

//buscar productos

app.get('/buscar/:termino', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    let termino = req.params.termino;
    var regex = new RegExp(termino, 'i');

    Producto.find({ $or: [{ etiquetas: regex }, { nombre: regex }] })
        .skip(desde)
        .limit(12)
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Producto.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    producto: producto,
                    conteo: conteo
                });
            })
        });
});

//crear nuevo Producto

app.post('/', mdAautenticacion.verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        categoria: body.categoria,
        subCategoria: body.subCategoria,
        nombre: body.nombre,
        precio: body.precio,
        usuario: body.usuario,
        descripcion: body.descripcion,
        principal: body.principal,
        etiquetas: body.etiquetas,
        random: Math.random(),
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear Producto',
                err: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear el producto'
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});

//actualizar productos

app.put('/:id', [mdAautenticacion.verificaToken], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al buscar usuario",
                errors: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: "el producto del id: " + id + " no existe",
                errors: { message: "no existe un usuario con ese ID" }
            });
        }
        producto.categoria = body.categoria;
        producto.subCategoria = body.subCategoria;
        producto.nombre = body.nombre;
        producto.precio = body.precio;
        producto.usuario = req.usuario._id;
        producto.descripcion = body.descripcion;
        producto.principal = body.principal;
        producto.etiquetas = body.etiquetas;

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "error al actualizar usuario",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        })
    });
})

//borrar Productos de la base de datos

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al borrar de la BD",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado
        });
    });

})

// obtiene productos por categoria

app.get('/categoria/:id', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var id = req.params.id;
    Producto.find({ categoria: id })
        .skip(desde)
        .limit(12)
        .populate('producto', 'nombre img precio')
        .exec((err, productoCat) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Producto.count({ categoria: id }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productoCat: productoCat,
                    conteo: conteo
                });
            })
        });
});

// obtiene porductos por subcategoria

app.get('/subcategoria/:id', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var id = req.params.id;
    Producto.find({ subCategoria: id })
        .skip(desde)
        .limit(12)
        .populate('producto', 'nombre img precio')
        .exec((err, productoSubCat) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            Producto.count({ subCategoria: id }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productoSubCat: productoSubCat,
                    conteo: conteo
                });
            })
        });
});



module.exports = app;