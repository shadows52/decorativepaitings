var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var DatosEnvioSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    pais: { type: String, required: true, default: 'Mexico' },
    estado: { type: String, required: true },
    municipio: { type: String, required: true },
    calle: { type: String, required: true },
    colonia: { type: String, required: true },
    codigopostal: { type: Number, required: true },
    nombre: { type: String, required: true },
    apeido: { type: String, required: true },
    referencias: { type: String, required: false },
    telefono: { type: Number, required: false },
    Venta: { type: String, required: true, default: 'sinID' }
}, { collection: 'datosEnvio' })
module.exports = mongoose.model('DatosEnvio', DatosEnvioSchema);