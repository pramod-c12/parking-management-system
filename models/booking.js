'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Booking belongs to a user
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Booking belongs to a slot
      Booking.belongsTo(models.Slot, {
        foreignKey: 'slotId',
        as: 'slot',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    carNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/
      }
    },
    carType: {
      type: DataTypes.ENUM('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
