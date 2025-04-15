const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const db = {};
const basename = path.basename(__filename);

// Dynamically import all models in the models folder
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Call associate() method if it exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize instance and connection function
db.sequelize = sequelize;

db.connectDB = async () => {
  try {
    await sequelize.sync({ force: false }); // Change to true if you want to drop tables on each run
    console.log('Database connected and synced!');
  } catch (err) {
    console.error('DB sync error:', err);
  }
};

module.exports = db;
