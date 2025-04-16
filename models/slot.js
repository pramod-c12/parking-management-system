'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate(models) {
      Slot.hasMany(models.Booking, {
        foreignKey: 'slotId',
        as: 'bookings',
      });
    }
  }

  Slot.init({
    slotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[A-Z]\d{1,2}$/i,
      },
    },
  }, {
    sequelize,
    modelName: 'Slot',
  });

  return Slot;
};
