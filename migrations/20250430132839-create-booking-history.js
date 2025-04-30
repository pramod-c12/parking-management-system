'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookingHistory', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      slotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      slotNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      carNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      carType: {
        type: Sequelize.ENUM('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookingHistory');
  },
};