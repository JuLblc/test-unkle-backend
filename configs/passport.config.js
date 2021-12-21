const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model');

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, cb) => cb(null, user.id));

  passport.deserializeUser((id, cb) => {
    User.findByPk(id)
      .then(user => cb(null, user))
      .catch(err => cb(err));
  });

  //Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // by default
        passwordField: 'password' // by default
      },
      (email, password, done) => {
        User.findOne({ where: { email: email } })
          .then(user => {
            if (!user) {
              return done(null, false, { message: `Aucun compte utilisateur n'est relié à ${email}` });
            }

            if (password !== user.password) {
              return done(null, false, { message: `Le mot de passe ne correspond pas à l'adresse ${email}` });
            }

            done(null, user);
          })
          .catch(err => done(err));
      }
    )
  );
}