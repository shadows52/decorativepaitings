var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var imagenProductoSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    imagen: { type: String, required: true },

}, { collection: 'imagenesProducto' })

imagenProductoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('ImagenProducto', imagenProductoSchema);