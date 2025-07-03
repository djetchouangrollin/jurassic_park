module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('incidents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'resolved', 'high', 'critical'),
        defaultValue: 'open',
        allowNull: false
      },
      urgency: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reportedBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resolvedAt: {
        type: Sequelize.DATE
      },
      resolutionDescription: {
        type: Sequelize.TEXT
      },
      resolutionStaff: {
        type: Sequelize.STRING
      },
      statusComments: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('incidents');
  }
};
