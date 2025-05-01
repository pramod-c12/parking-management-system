require('dotenv').config();
const url = process.env.DATABASE_URL;

module.exports = {
  development: {
    url: url || 'postgresql://postgres:abc123@localhost:5432/parking_db',
    dialect: 'postgres',
    dialectOptions: url
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
  production: {
    url: url,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
