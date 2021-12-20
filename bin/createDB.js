require('dotenv').config();

const pgtools = require('pgtools');

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
  }
  console.log(`${process.env.PGDATABASE} successfully created`)
});