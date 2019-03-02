var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ventaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    monto: { type: Number, required: true },
    fecha: { type: String, required: true },
    pagado: { type: Boolean, required: false, default: false },
    envio: { type: String, required: true, default: 'en espera de pago' }
}, { collection: 'ventas' })
module.exports = mongoose.model('Ventas', ventaSchema);