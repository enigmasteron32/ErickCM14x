const mongoose = require('mongoose');
const Idr = mongoose.model('Idr');

// router.get('/', getIdr)
function getIdr(req, res, next) {
  //Obtener-Leer
  if (req.params.id) {//Si solo pasan el ID
    Idr.findById(req.params.id)
      .then(uno => { res.send(uno) })
      .catch(next)
  } else { //Se pide toda la lista
    Idr.find()
      .then(todos => { res.send(todos) })
      .catch(next)
  }
}

// router.post('/', postIdr)
function postIdr(req, res, next) {
  let idr = new Idr(req.body)
  idr.save().then(idr => {
    res.status(200).send(idr)
  }).catch(next)
}

// router.put('/:id', putIdr)
function putIdr(req, res, next) {
  //Modificar-Actualizar
  console.log(req.body);
  Idr.findById(req.params.id)
    .then(idr => {
      console.log("entroooo");
      if (!idr) {
        return postIdr(req, res, next)
      }
      let nuevaInfo = req.body
      if (typeof nuevaInfo.anuncios !== 'undefined')
      idr.anuncios = nuevaInfo.anuncios
      if (typeof nuevaInfo.bloque !== 'undefined')
        idr.bloque = nuevaInfo.bloque
      if (typeof nuevaInfo.datos !== 'undefined')
        idr.datos = nuevaInfo.datos

      idr.save().then(updated => {
        res.status(201).json(updated.publicData())
      }).catch(next)
    }).catch(next)

}

// router.delete('/:id', deleteIdr)
function deleteIdr(req, res, next) {
  //Borrar
  Idr.findOneAndDelete({ _id: req.params.id })
    .then(r => { res.status(200).send("El idr se ha eliminado...") })
    .catch(next)
}

function validateToken(req, res, next){
  return res.json({
    ok: true,
    id: req.params.id
  })
}

//Exportamos las funciones definidas
module.exports = {
  getIdr,
  postIdr,
  putIdr,
  deleteIdr,
  validateToken
};
