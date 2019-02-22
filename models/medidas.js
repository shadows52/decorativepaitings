var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var schema = mongoose.Schema;

var medidaSchema = new schema({
    proporcion: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
}, { collection: 'medidas' })

medidaSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('Medida', medidaSchema);