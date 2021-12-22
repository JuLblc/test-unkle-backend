require('dotenv').config();

const pgtools = require('pgtools');
const db = require('../configs/db.config');
const User = require('../models/User.model');
const Option = require('../models/Option.model');

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  host: process.env.PGHOST
}

const options = [
  'Incendie',
  'Inondation',
  'Seisme',
  'Tornade',
  'Tsunamie'
]

const optionPromises = [];

pgtools.createdb(config, process.env.PGDATABASE, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  } else {
    console.log(`${process.env.PGDATABASE} successfully created`)

    db.sync()
      .then(() => {
        console.log('DB initialized');

        // Create admin user
        User.create({
          password: 'admin',
          email: 'admin@admin.fr',
          role: 'admin',
        })
          .then(() => {
            console.log('Admin created')
            //Create options for contracts
            options.forEach(option => optionPromises.push(
              Option.create({
                description: option
              })
            ))

            Promise.allSettled(optionPromises)
              .then(() => {
                console.log('Options created')
                db.close();
              })
              .catch(err => console.log(err))
          })
      })
      .catch(err => console.log(err));
  }
});