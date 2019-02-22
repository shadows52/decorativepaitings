var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var mensajeUsuarioSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    mensaje: { type: String, required: true },
    asunto: { type: String, required: false }

}, { collection: 'mensajesUsuario' })
module.exports = mongoose.model('MensajeUsuario', mensajeUsuarioSchema);