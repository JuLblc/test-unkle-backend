const Sequelize = require('sequelize');
const db = require('../configs/db.config');
const UserContract = require('../models/UserContract.model');
const Contract = require('./Contract.model');

const User = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull:true,
  },
  password: {
    type: Sequelize.STRING,    
  },
  role: {
    type: Sequelize.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  }
})

User.belongsToMany(Contract, {through: "UserContract", foreignKey:"userId", onDelete: "CASCADE"});
Contract.belongsToMany(User, {through: "UserContract", foreignKey:"contractId", onDelete: "CASCADE"});

module.exports = User;