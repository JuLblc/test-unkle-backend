const Sequelize = require('sequelize');
const db = require('../configs/db.config');

const UserContract = db.define("UserContract", {
  id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
  },
  userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: "users",
          key: "id"
      },
      onDelete: "CASCADE"
  },
  contractId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: "contracts",
          key: "id"
      },
      onDelete: "CASCADE"
  },
  status: Sequelize.ENUM('pending', 'active', 'finished'),
  endingDate: {
    type: Sequelize.DATE
  }
},
{
  freezeTableName: true,
});

module.exports = UserContract;