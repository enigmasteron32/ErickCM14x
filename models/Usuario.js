const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const crypto = require('crypto');
//Importando módulo crypto, pendiente de instalar.
const jwt = require('jsonwebtoken');
//Importando módulo jsonwebtoken, pendiente de instalar.
const secret = require('../config').secret;
// ???? es un misterio que resolveremos en la última sesión

const UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Falta email'],
        match: [/\S+@\S+.\S+/, 'Email invalido'],
        index: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: [true, 'Falta empresa']
    },
    telefono: {
        type: String,
        unique: false
    },
    telefono2: {
        type: String,
        unique: false
    },
    hash: String,
    salt: String
}, { collection: "Usuarios", timestamps: true })
//Nuestro modelo, la collection de mongo y timestamp nos da la ultima modificación o fecha cuendo se creo o se hace una modificacion  lo guarda en nuestro documento

UsuarioSchema.plugin(uniqueValidator, { message: 'Email ya existe' })

UsuarioSchema.methods.crearPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex"); // generando una "sal" random para cada usuario
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex"); // generando un hash utilizando la salt
};

UsuarioSchema.methods.validarPassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
};

UsuarioSchema.methods.generarJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 90); // 90 días antes de expirar

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UsuarioSchema.methods.toAuthJSON = function () {
    return {
        // username: this.username,
        email: this.email,
        id: this.id,
        token: this.generarJWT()
    };
};

//Nos regresa los datos publicos del schema , los que no estsn son privados
UsuarioSchema.methods.publicData = function () {
    return {
        id: this.id,
        email: this.email,
        nombre: this.nombre,
        apellido: this.apellido,
        telefono: this.telefono,
        telefono2: this.telefono2,
        empresa: this.empresa,
    }
}

//Definimos Usuario refiriendonos al Modelo la clase lo asociamos al esquema
mongoose.model("Usuario", UsuarioSchema)