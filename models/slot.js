'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Define associations here
     */
    static associate(models) {
      Slot.belongsTo(models.User, {
        foreignKey: 'bookedBy',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }

    /**
     * Optional static method to book a slot
     */
    static async book(slotNumber, userId) {
      const slot = await Slot.findOne({ where: { slotNumber, isAvailable: true } });
      if (!slot) {
        throw new Error('Slot not available or already booked');
      }

      slot.isAvailable = false;
      slot.bookedBy = userId;
      slot.bookedAt = new Date();
      await slot.save();

      return slot;
    }
  }

  Slot.init({
    slotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[A-Z]\d{1,2}$/i  // Optional format: A1, B10, etc.
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bookedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bookedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    carNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/ // Validates the format
      }
    },
    carType: {
      type: DataTypes.ENUM('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'),
      allowNull: true
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 12
      }
    }
  }, {
    sequelize,
    modelName: 'Slot',
  });

  return Slot;
};
