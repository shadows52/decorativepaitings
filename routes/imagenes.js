var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/producto/:img', (req, res, ) => {

    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/productos/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathDefault = path.resolve(__dirname, '../assets/no-imagen.jpg');
        res.sendFile(pathDefault);
    }
})

app.get('/creados/:img', (req, res) => {
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/creados/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathDefault = path.resolve(__dirname, '../assets/no-imagen.jpg');
        res.sendFile(pathDefault);
    }
})


module.exports = app;