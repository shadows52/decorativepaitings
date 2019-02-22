var express = require('express');

var mdAautenticacion = require('../middlewares/autenticacion');
var app = express();


var Subcategoria = require('../models/subcategoria');

// mustra todas las subcategorias
app.get('/', (req, res) => {
    Subcategoria.find({})
        .populate('categoria')
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                subcategoria: subcategoria
            });
        });

});

//obtiene subcategorias por ID de categoria

app.get('/cat/:id', (req, res) => {
    let id = req.params.id;
    Subcategoria.find({ categoria: id })
        .populate('categoria')
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                subcategoria: subcategoria
            });
        });
});


//crear nueva subcategoria

app.post('/', mdAautenticacion.verificaToken, (req, res) => {
    let body = req.body;

    let subcategoria = new Subcategoria({
        categoria: body.categoria,
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    subcategoria.save((err, subCategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear subcategoria',
                err: err
            })
        }
        if (!subCategoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear la subcategoria'
            })
        }
        res.status(201).json({
            ok: true,
            subcategoria: subCategoriaDB
        });
    })
});

//actualiza una subcategoria

app.put('/:id', mdAautenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Subcategoria.findById(id, (err, subcat) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al conectar con el servidor',
                err: err
            })
        }
        if (!subcat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la subcategoria con el id ' + id + 'no existe',
                err: { messaje: 'no existe un subcategoria con ese ID' }
            })
        }
        subcat.categoria = body.categoria;
        subcat.nombre = body.nombre;
        subcat.descripcion = body.descripcion;

        subcat.save((err, newsubCategoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar categoria',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                categoria: newsubCategoria

            });
        })

    })
});

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Subcategoria.findByIdAndRemove(id, (err, subCategoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el usuario',
                err: err
            })
        }
        if (!subCategoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe categoria con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            borrada: subCategoriaBorrada
        })
    })
});

module.exports = app;