import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface IncidentAttributes {
  id: number;
  description: string;
  status: 'open' | 'resolved' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionDescription?: string;
  resolutionStaff?: string;
  statusComments?: string;
}

export interface IncidentCreationAttributes {
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedBy: string;
  status?: 'open' | 'resolved' | 'high' | 'critical';
}

export class Incident extends Model<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  declare id: number;
  declare description: string;
  declare status: 'open' | 'resolved' | 'high' | 'critical';
  declare urgency: 'low' | 'medium' | 'high' | 'critical';
  declare location: string;
  declare reportedBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare resolvedAt?: Date;
  declare resolutionDescription?: string;
  declare resolutionStaff?: string;
  declare statusComments?: string;
}

Incident.init({
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
    defaultValue: 'open'
  },
  urgency: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
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
  resolutionDescription: {
    type: DataTypes.TEXT
  },
  resolutionStaff: {
    type: DataTypes.STRING
  },
  statusComments: {
    type: DataTypes.TEXT
  },
  resolvedAt: {
    type: DataTypes.DATE
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Incident',
  timestamps: true
});

export default Incident;
