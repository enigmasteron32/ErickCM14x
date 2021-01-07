const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const crypto = require('crypto');
//Importando módulo crypto, pendiente de instalar.
const jwt = require('jsonwebtoken');
//Importando módulo jsonwebtoken, pendiente de instalar.
const secret = require('../config').secret;
// ???? es un misterio que resolveremos en la última sesión

const IdrSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    anuncios: {
        type: Object,
    },
    bloque: {
        type: Number
    },
    datos: {
        type: Object,
    }
}, { collection: "Idr", timestamps: true })
//Nuestro modelo, la collection de mongo y timestamp nos da la ultima modificación o fecha cuendo se creo o se hace una modificacion  lo guarda en nuestro documento

IdrSchema.methods.publicData = () => {
    //Regresará lo siguientes atributos
    return {
        id: this.id,
        anuncios: this.anuncios,
        bloque: this.bloque,
        datos: this.datos,
    };
};

//Definimos Usuario refiriendonos al Modelo la clase lo asociamos al esquema
mongoose.model("Idr", IdrSchema)