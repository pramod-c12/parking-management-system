const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'parking_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'abc123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  }
);

module.exports = sequelize;
