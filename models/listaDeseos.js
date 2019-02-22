var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var listaDeseosSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
}, { collection: 'listaDeseos' })

module.exports = mongoose.model('ListaDeseos', listaDeseosSchema);