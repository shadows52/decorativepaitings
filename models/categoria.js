var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var categoriaProductoSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'la categoria  debe ser unica'] },
    descripcion: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
}, { collection: 'categoriasProducto' })

categoriaProductoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('CategoriaProducto', categoriaProductoSchema);