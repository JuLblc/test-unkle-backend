const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,       //maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000,          //maximum time, in milliseconds, that a connection can be idle before being released 
  }
});

module.exports = sequelize;