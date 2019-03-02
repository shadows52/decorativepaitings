var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var cuadroCreadoSchema = new Schema({
    precio: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cantidad: { type: Number, required: true, default: 1 },
    imgOriginal: { type: String, required: true },
    imgCreada: { type: String, required: true },
    Venta: { type: String, required: true, default: 'sinID' }
}, { collection: 'cuadrosCreados' })

cuadroCreadoSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser unico' });
module.exports = mongoose.model('CuadrosCreados', cuadroCreadoSchema);