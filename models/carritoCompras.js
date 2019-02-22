var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var carritoCompraSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    producto: { type: Schema.Types.ObjectId, required: true, ref: 'Producto' },
    cantidad: { type: Number, required: true, default: 1 },
    pagado: { type: Boolean, required: false, default: false },
    Venta: { type: String, required: true, default: 'sinID' }
}, { collection: 'carritoCompras' })
module.exports = mongoose.model('CarritoCompras', carritoCompraSchema);