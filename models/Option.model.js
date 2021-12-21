const Sequelize = require('sequelize');
const db = require('../configs/db.config');

const Option = db.define('options', {
  description: {
    type: Sequelize.STRING,
  }
})

module.exports = Option;