var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var productoSchema = new Schema({
    categoria: { type: Schema.Types.ObjectId, ref: 'CategoriaProducto', required: true },
    subCategoria: { type: Schema.Types.ObjectId, ref: 'SubCategoriaProducto', required: true },
    nombre: { type: String, unique: true, required: [true, 'el nombre es necesario'] },
    precio: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    imgOriginal: { type: String, required: false },
    ventas: { type: Number, required: false },
    principal: { type: Boolean, required: false, default: false },
    random: { type: Number, required: false },
    medidas: { type: Schema.Types.ObjectId, ref: 'Medida', required: false },
    etiquetas: { type: String, required: false }
}, { collection: 'productos' })

productoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('Producto', productoSchema);