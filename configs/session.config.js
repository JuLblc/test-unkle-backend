const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);
const db = require('./db.config');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 6000000 // 60 * 1000 ms === 1 min
      },
      store: new SessionStore({
        db: db,
      })
    })
  );
};