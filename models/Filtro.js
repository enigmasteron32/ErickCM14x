const mongoose = require('mongoose');

const FiltroSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    telefonos: {
        type: Object,
    },
    dominios: {
        type: Object
    },
    empresas: {
        type: Object
    }
}, { collection: "Filtro", timestamps: true })
//Nuestro modelo, la collection de mongo y timestamp nos da la ultima modificación o fecha cuendo se creo o se hace una modificacion  lo guarda en nuestro documento

FiltroSchema.methods.publicData = () => {
    //Regresará lo siguientes atributos
    return {
        id: this.id,
        telefonos: this.telefonos,
        dominios: this.dominios,
        empresas: this.empresas
    };
};

//Definimos Usuario refiriendonos al Modelo la clase lo asociamos al esquema
mongoose.model("Filtro", FiltroSchema)