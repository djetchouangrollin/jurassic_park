import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('incidents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'open'
    },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resolvedAt: {
      type: DataTypes.DATE
    },
    resolutionDescription: {
      type: DataTypes.TEXT
    },
    resolutionStaff: {
      type: DataTypes.STRING
    },
    statusComments: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('incidents');
}
