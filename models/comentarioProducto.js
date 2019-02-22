var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var schema = mongoose.Schema;

var comentariosProductoSchema = new schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    comentario: { type: String, required: false },

}, { collection: 'comentariosProducto' })

comentariosProductoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('ComentariosProducto', comentariosProductoSchema);