const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('parking_db', 'postgres', 'abc123', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  retry: {
    max: 10,      // Retry up to 10 times
  },
});

module.exports = sequelize;
