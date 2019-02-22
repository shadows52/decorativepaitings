var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var subCategoriaProductoSchema = new Schema({
    categoria: { type: Schema.Types.ObjectId, ref: 'CategoriaProducto', required: true },
    nombre: { type: String, unique: true, required: [true, 'la categoria  debe ser unica'] },
    descripcion: { type: String, required: false },
}, { collection: 'subCategoriasProducto' })

subCategoriaProductoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('SubCategoriaProducto', subCategoriaProductoSchema);