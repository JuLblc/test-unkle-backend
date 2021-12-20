const Sequelize = require('sequelize');
const db = require('../configs/db.config');

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