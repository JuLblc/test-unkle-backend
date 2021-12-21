require('dotenv').config();

const pgtools = require('pgtools');
const db = require('../configs/db.config');
const User = require('../models/User.model');

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  host: process.env.PGHOST
}

pgtools.createdb(config, process.env.PGDATABASE, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  } else {
    console.log(`${process.env.PGDATABASE} successfully created`)

    db.sync()
      .then(() => {
        console.log('DB initialized');

        User.findOrCreate({
          where: {
            password: 'admin',
            email: 'admin@admin.fr',
            role: 'admin',
          }
        })
        .then(()=>{
          console.log('Admin created')
          db.close();
        })
      })
      .catch(err => console.log(err));
  }
});