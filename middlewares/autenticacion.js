var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//verificatoken

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token no valido',
                err: err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}

//verificar Admin

exports.verificaAdmin_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ALCACHOFA7891_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: "NO tienes permiso para ingresar a esta paginaaaa",
            errors: { mesage: 'no eres admin amigo' }
        });
    }
}

exports.verificaAdmin_o_MISMO = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: "no te puedes elimitar a ti mismo",
            errors: { mesage: 'no lo haga compa' }
        });
    }
}