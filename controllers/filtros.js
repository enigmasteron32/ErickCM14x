// controllers/usuarios.js
const mongoose = require("mongoose")
const Filtro = mongoose.model("Filtro")

function getFiltros(req, res, next) {
    Filtro.find()
        .then(todos => { res.send(todos) })
        .catch(next)
}

module.exports = {
    getFiltros
}