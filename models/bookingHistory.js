'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookingHistory extends Model {
    static associate(models) {
      // No associations needed for historical data
    }
  }

  BookingHistory.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slotNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      carNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carType: {
        type: DataTypes.ENUM('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BookingHistory',
      tableName: 'BookingHistory',
    }
  );

  return BookingHistory;
};