// controllers/usuarios.js
const mongoose = require("mongoose")
const Usuario = mongoose.model("Usuario")
const passport = require('passport');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// console.log(accountSid,authToken )

const nodemailer = require("nodemailer");
const { google } = require("googleapis");


var http = require("https");
var btoa = require("btoa");


async function crearUsuario(req, res, next) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  const body = req.body,
    password = body.password

  delete body.password
  const usuario = new Usuario(body)
  usuario.crearPassword(password)
  let enviar = await enviarEmail(body);
  console.log(enviar, "linea 27");
  usuario.save().then(async user => {                                         //Guardando nuevo usuario en MongoDB.
    console.log(password, "linea 29")
    let enviar = await enviarEmailAccesos(body, password);
    console.log(enviar, "linea 31");
    // enviarSMS(body, password);
    return res.status(201).json(user.toAuthJSON())
  }).catch(next)
}

function obtenerUsuarios(req, res, next) {                              //Obteniendo usuario desde MongoDB.
  // if(req.usuario.id){
  //   console.log("Hay usuairo")
  //   console.log(req.usuario.id);
  //   console.log(req.usuario)
  // }
  Usuario.findById(req.usuario.id, (err, user) => {
    if (!user || err) {
      // console.log(err)
      return res.sendStatus(401)
    }

    return res.json(user.publicData());
  }).catch(next);
}

function iniciarSesion(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "no puede estar vacío" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "no puede estar vacío" } });
  }

  //session india que no puede tener mas de una sesion, es un metido de autenticate
  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generarJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

async function envioEmailRestriccion(req, res, next) {
  const body = req.body;
  let enviar = await enviarEmail(body);
  console.log(enviar, "linea 78");
  console.log("correo enviado")
  return res.status(200).json(body)
}

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

process.env.ACCESS_TOKEN = oauth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },

});

enviarEmailAccesos = (mensaje, password) => {
  let msj = `<p>Muchas gracias por registrarse en IDR demo el línea<p>` +
    `<p>Sus accesos para ingresar son: <p>` +
    `<p>Email: ${mensaje.email}</p>` +
    `<p>Password: ${password}</p>`;
  return new Promise(resolve => {
    sendMailAccesos(msj, mensaje, info => {
      console.log("Ha sido enviado el correo");
      console.log(info, "linea 115")
      resolve(info)
    })
  })
}

enviarEmail = (mensaje) => {
  let msj = `<p>Este usuario se registro o intento registrarse en IDR demo en línea<p>` +
    `<p>Nombre: ${mensaje.nombre} ${mensaje.apellido}</p>` +
    `<p>Empresa: ${mensaje.empresa}</p>` +
    `<p>Email: ${mensaje.email}</p>` +
    `<p>Telèfono: ${mensaje.telefono}</p>`;
  return new Promise(resolve => {
    sendMail(msj, info => {
      console.log("Ha sido enviado el correo");
      console.log(info, "linea 130")
      resolve(info)
    })
  })
}

async function sendMailAccesos(mensaje, body, callback) {

  let mailOptions = {
    from: 'IDR <idr.enlinea@gmail.com>',
    to: body.email,
    // cc: ['contacto@solucionesavanzadasyserviciosdigitales.com'],
    subject: "Accesos IDR en línea",
    text: mensaje,
    html: mensaje,
    auth: {
      user: process.env.EMAIL,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    }
  }

  let info = await transporter.sendMail(mailOptions);

  callback(info, "linea 154");
}

async function sendMail(mensaje, callback) {

  let mailOptions = {
    from: 'IDR <idr.enlinea@gmail.com>',
    to: 'idr.enlinea@gmail.com',
    // cc: ['contacto@solucionesavanzadasyserviciosdigitales.com'],
    subject: "Registro IDR en línea",
    text: mensaje,
    html: mensaje,
    auth: {
      user: process.env.EMAIL,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    }
  }

  let info = await transporter.sendMail(mailOptions);

  callback(info, "linea 175");
}

enviarSMS = function (body, password) {

  // client.messages
  // .create({
  //   to: `+52${body.telefono}`,
  //   from: '+19404003850',
  //   body: `¡Bienvenido ${body.nombre}!, tus credenciales de acceso a IDR demo en línea son las siguientes. Usuario: ${body.email} | Password: ${password}`,
  // })
  // .then(message => console.log(message.sid));

  var options = {
    "method": "POST",
    "hostname": "api.labsmobile.com",
    "path": "/json/send",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa("erick@mercadology.mx:uOoSZS2cgjW23tjBkv3nrhhSIG7gTxMe"),
      "Cache-Control": "no-cache"
    }
  };

  var req = http.request(options, function (res) {
    console.log(req);
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(JSON.stringify({
    "message": `¡Bienvenido ${body.nombre}!, tus credenciales de acceso a IDR demo en línea son las siguientes. Usuario: ${body.email} | Password: ${password}`,
    "tpoa": "Sender",
    "recipient":
      [
        {
          "msisdn": `+52${body.telefono}`
        }
      ]
  }));
  req.end();
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  iniciarSesion,
  envioEmailRestriccion
}