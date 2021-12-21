require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const logger       = require('morgan');
const path         = require('path');

const db = require('./configs/db.config');
require('./models/User.model');

db.sync()
  .then(() => {
    console.log('DB initialized');
  })
  .catch(err => console.log(err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
require('./configs/session.config')(app);
require('./configs/passport.config')(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes)

module.exports = app;