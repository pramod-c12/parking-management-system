const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('parking_db', 'postgres', 'abc123', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
