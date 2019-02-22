var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//google
var CLIENT_ID = require('../config/config').CLIENT_ID;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
var mdAutenticacion = require('../middlewares/autenticacion');

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {
    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 28800 }); // 4 horas
    res.status(200).json({
        ok: true,
        token: token
    })
});

//autenticacion google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}
app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                mensaje: "token no valido"
            });
        })
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'debe de usar su autenticacion normal',
                    errors: err
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }); // 4 horas
                usuarioDB.password = 'ella no te ama';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                })
            }
        } else {
            // el usuario no existe ay que crearlo
            var usuario = new Usuario;
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }); // 4 horas
                usuarioDB.password = 'ella no te ama';
                res.status(200).json({
                    ok: true,
                    login: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                })
            })
        }
    });
});

//autenticacion Facebbok

app.post('/facebook', (req, res) => {
    var facebookUser = req.body;
    Usuario.findOne({ idFB: facebookUser.idFB }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crearUsuario',
                errors: err
            });
        }
        if (usuarioDB) {
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }); // 4 horas
            usuarioDB.password = 'ella no te ama';
            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id
            })
        } else {
            // el usuario no existe ay que crearlo
            var usuario = new Usuario;
            usuario.nombre = facebookUser.nombre;
            usuario.email = facebookUser.idFB + '@facebook.com';
            usuario.img = facebookUser.img;
            usuario.idFB = facebookUser.idFB;
            usuario.facebook = true;
            usuario.password = ":)";
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al crearUsuario',
                        errors: err
                    });
                }
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }); // 4 horas
                usuarioDB.password = 'ella no te ama';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                })
            })
        }
    });

});

//autenticacion normal
app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuarios'
            });
        }
        if (!usuarioBD) {
            return res.status(500).json({
                ok: false,
                mensaje: 'credenciales incorrectas'
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(500).json({
                ok: false,
                mensaje: 'credenciales incorrectas'
            });
        }
        //crear un token
        usuarioBD.password = 'ella no te ama';
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 28800 }); // 8 horas
        res.status(200).json({
            ok: true,
            mensaje: 'login correcto',
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        })
    })
});


module.exports = app;