var express = require('express');

var mdAautenticacion = require('../middlewares/autenticacion');

var app = express();


var Categoria = require('../models/categoria');

// mustra todas las categorias
app.get('/', (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al conectar con la base de datos',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                categorias: categorias
            });
        });

});

//mostrar una categoria por ID

app.get('/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaId) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al conectar con la base de datos',
                err: err
            })
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaId
        });
    })

});

//crear nueva categoria

app.post('/', mdAautenticacion.verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: body.usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear categoria',
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se pudo crear la categoria'
            })
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//actualiza una categoria

app.put('/:id', mdAautenticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al conectar con el servidor',
                err: err
            })
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la categoria con el id' + id + 'no existe',
                err: { messaje: 'no existe un categoria con ese ID' }
            })
        }

        categoria.nombre = body.nombre;
        categoria.descripcion = body.descripcion;

        categoria.save((err, newCategoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar categoria',
                    err: err
                })
            }
            res.status(200).json({
                ok: true,
                categoria: newCategoria

            });
        })

    })
});

app.delete('/:id', mdAautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el usuario',
                err: err
            })
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe categoria con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            borrada: categoriaBorrada
        })
    })
});

module.exports = app;