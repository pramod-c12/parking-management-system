const url = process.env.DATABASE_URL;

module.exports = {
  development: {
    url: url || 'postgresql://postgres:securepassword123@localhost:5432/parking_db',
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
  test: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:securepassword123@localhost:5432/parking_test_db',
    dialect: 'postgres',
    dialectOptions: process.env.DATABASE_URL
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