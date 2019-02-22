var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var statusSchema = new Schema({
    idPago: { type: Number, required: false, unique: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    status: { type: String, required: false },
    topic: { type: String, required: false }
}, { collection: 'statusPago' })
module.exports = mongoose.model('StatusPago', statusSchema);