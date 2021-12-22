const Sequelize = require('sequelize');
const db = require('../configs/db.config');
const Option = require('../models/Option.model');

const Contract = db.define('contracts', {
  startingDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
})

Contract.belongsToMany(Option, {through: "contract_option"});
Option.belongsToMany(Contract, {through: "contract_option"});

module.exports = Contract;