'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have many bookings
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        as: 'bookings',
      });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },    
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
