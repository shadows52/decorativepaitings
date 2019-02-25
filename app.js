// requires
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//inicializar variables

const app = express();

//configuracion de cabezeras

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS')
    next();
});

//bodyparser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//importar rutas
var categoriaRoutes = require('./routes/categoria');
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var productoRoutes = require('./routes/producto');
var subCategoriaRoutes = require('./routes/subcategoria');
var productoRoutes = require('./routes/producto');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var carritoRoutes = require('./routes/carrito');
var deseosRoutes = require('./routes/deseos');
var creadoRoutes = require('./routes/cuadroCreado');
var medidasRoutes = require('./routes/medidas');
var mensajesRoutes = require('./routes/mensajes');
var envioRoutes = require('./routes/datosEnvio');
var pagoRoutes = require('./routes/pago');
//coneccion a la base de datos
const uri = "mongodb+srv://carlosAdmin:jitomate789@decorativedb-uyjb9.mongodb.net/cuadrosDB";
mongoose.connect(uri, (err, res) => {
    if (err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online');
});


//rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/producto', productoRoutes);
app.use('/subcategoria', subCategoriaRoutes);
app.use('/producto', productoRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/carrito', carritoRoutes);
app.use('/deseos', deseosRoutes);
app.use('/creatucuadro', creadoRoutes);
app.use('/mensajes', mensajesRoutes);
app.use('/medidas', medidasRoutes);
app.use('/envio', envioRoutes);
app.use('/pago', pagoRoutes);
app.use('/', appRoutes);



//escuchar peticiones

app.listen(3400, () => {
    console.log('express server corriendo en el puerto ' + 3400 + ' \x1b[32m%s\x1b[0m', 'online');
});