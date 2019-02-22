var express = require('express');
var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();
var CuadrosCreados = require('../models/cuadroCreado');
var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
//obtiene todos los cuadros terendy creados por los clientes

app.get('/', mdAautenticacion.verificaToken, (req, res) => {

    CuadrosCreados.find({})
        .exec((err, cuadrosCreados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                cuadrosCreados: cuadrosCreados
            });
        });

});

// obtiene cuadros creados por ID de usuario

app.get('/usuario/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    CuadrosCreados.find({ usuario: id })
        .exec((err, cuadrosCreados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                cuadrosCreados: cuadrosCreados
            });
        });
});

app.post('/', mdAautenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = body.usuario;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no se encontro la imagen a subir',
            err: { mesage: 'debe de seleccionar una imagen' }
        })
    }
    var imagenOriginal = req.files.imagenOriginal;
    // var imagenCreada = req.files.imagenCreada;
    var nombrecortado1 = imagenOriginal.name.split('.');
    var extencion1 = nombrecortado1[nombrecortado1.length - 1];
    // var nombrecortado2 = imagenCreada.name.split('.');
    // var extencion2 = nombrecortado2[nombrecortado2.length - 1];

    var extencionesPermitidas = ['jpg', 'png', 'jpeg', 'svg'];

    if (extencionesPermitidas.indexOf(extencion1) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'extencion no permitida en imagen original',
            err: { mesage: 'solo se permiten las siguientes extenciones jpg, png, jpeg y gif' }
        })
    }
    /*
    if (extencionesPermitidas.indexOf(extencion2) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'extencion no permitida en imagen Creada',
            err: { mesage: 'solo se permiten las siguientes extenciones jpg, png, jpeg y gif' }
        })
    } */
    //nombre del archivo personalizado
    var nombreArchivoIMGO = `${id}-Original-${new Date().getMilliseconds()}.${extencion1}`;
    // var nombreArchivoIMGC = `${id}-Creada-${new Date().getMilliseconds()}.${extencion2}`;

    // mover el archivo del temporal a un path

    var pathOriginal = `./uploads/creados/${nombreArchivoIMGO}`;
    // var pathCreado = `./uploads/creados/${nombreArchivoIMGC}`;

    imagenOriginal.mv(pathOriginal, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al mover la imagen Original',
                err: err
            });
        }
    });
    /*
    imagenCreada.mv(pathCreado, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al mover la imagen Creada',
                err: err
            });
        }
    }); */
    let cuadroNuevo = new CuadrosCreados({
        precio: body.precio,
        usuario: id,
        cantidad: body.cantidad,
        imgOriginal: nombreArchivoIMGO,
        imgCreada: body.imgCreada
    });

    cuadroNuevo.save((err, cuadroDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear Cuadro nuevo',
                err: err
            })
        }
        if (!cuadroDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear el producto'
            })
        }
        return res.status(201).json({
            ok: true,
            cuadroDB: cuadroDB
        });
    });
});

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    CuadrosCreados.findByIdAndRemove(id, (err, creadoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el cuadro',
                err: err
            })
        }
        if (!creadoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un cuadro con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            creadoBorrado: creadoBorrado
        })
    })
})

// acutalizar cuadroCreado

app.put('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    CuadrosCreados.findById(id)
        .populate('productos', 'nombre')
        .exec((err, cuadroBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            cuadroBD.cantidad = body.cantidad
            cuadroBD.save((err, cuadroActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar carrito',
                        err: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    cuadro: cuadroActualizado

                });
            })
        });
})

module.exports = app;