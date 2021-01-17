// Express
const express = require('express');
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
app.use(cors());

//en git bash correr cuando estpy en entorno de desarrorllo, poner el comando "source ./config/env.sh"  y auomaticamente se exportan

//Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuración BDD
const mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGODB_URI, // obtiene la url de conexión desde las variables de entorno
	{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  );
  console.log(process.env.MONGODB_URI);
mongoose.set('debug', true)


//Vamos a hacer referencia donde se enuentran nuestros modelos, cargamos los modelos porque se deben cargar antes que las rutas
require('./models/Usuario')
require('./models/Idr')
require('./models/Filtro')

require('./config/passport')

app.use('/v1', require('./routes'));

// Iniciando el servidor

console.log(PORT);
app.listen(PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`)
})
