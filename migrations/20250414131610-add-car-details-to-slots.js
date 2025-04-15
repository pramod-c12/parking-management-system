'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Slots', 'carNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Slots', 'carType', {
      type: Sequelize.ENUM('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'),
      allowNull: true,
    });

    await queryInterface.addColumn('Slots', 'durationHours', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Slots', 'carNumber');
    await queryInterface.removeColumn('Slots', 'carType');
    await queryInterface.removeColumn('Slots', 'durationHours');
  }
};
