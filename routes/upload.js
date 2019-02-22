var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var Producto = require('../models/producto');

var fs = require('fs');

app.use(fileUpload());


app.put('/productos/:id', (req, res) => {
    var id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no es una imagen o no seleccionaste nada',
            err: { mesage: 'debe de seleccionar una imagen' }
        })
    }

    var archivo = req.files.imagen;
    var nombrecortado = archivo.name.split('.');
    var extencion = nombrecortado[nombrecortado.length - 1];

    //solo estas extenciones aceptamos

    var extencionesPermitidas = ['jpg', 'png', 'jpeg'];

    if (extencionesPermitidas.indexOf(extencion) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'extencion no permitida',
            err: { mesage: 'solo se permiten las siguientes extenciones jpg, png, jpeg y gif' }
        })
    }

    //nombre del archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    // mover el archivo del temporal a un path

    var path = `./uploads/productos/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al mover la imagen',
                err: err
            });
        }

        subirFotoProducto(id, nombreArchivo, res);

    })
})

function subirFotoProducto(id, nombreArchivo, res) {
    Producto.findById(id, (err, producto) => {

        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: "no se encontro el producto",
            });
        }
        var pathViejo = './uploads/productos/' + producto.img;
        //si existe elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
            fs.unlinkSync(pathViejo);
        }

        producto.img = nombreArchivo;
        producto.save((err, productoActualizado) => {
            return res.status(200).json({
                ok: true,
                mensaje: "Imagen de producto actualizado",
                imgproducto: productoActualizado
            });
        });
    })
}

module.exports = app;