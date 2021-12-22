const Sequelize = require('sequelize');
const db = require('../configs/db.config');
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

User.belongsToMany(Contract, {through: "user_contract"});
Contract.belongsToMany(User, {through: "user_contract"});

module.exports = User;