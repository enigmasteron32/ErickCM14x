const passport = require('passport');                       //Importando passport, middleware para autenticación.
const LocalStrategy = require('passport-local').Strategy;   //Importando estrategia autenticación. --> passport-local
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

passport.use(new LocalStrategy({                            //Configurando elementos utilizados para habilitar sesión.
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, next) {
  Usuario.findOne({ email: email })
  .then(function (user) {
    if (!user) {
      return next(null, false,{ errors:  'Email no existe' });
    }
    if(!user.validarPassword(password)){
        return next(null, false,{ errors: 'Contraseña equivocada'});
    }
    return next(null, user);
  }).catch(next);
}));