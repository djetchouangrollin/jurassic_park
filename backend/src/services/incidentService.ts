import { Incident, IncidentAttributes, IncidentCreationAttributes } from '../models/incident';
import { sequelize, QueryTypes } from '../config/database';

export interface CreateIncidentDTO extends Omit<IncidentCreationAttributes, 'status'> {
  status?: 'open' | 'resolved' | 'high' | 'critical';
}

export interface UpdateIncidentDTO {
  description?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  status?: 'open' | 'resolved' | 'high' | 'critical';
  resolvedAt?: Date;
  resolutionDescription?: string;
  resolutionStaff?: string;
  statusComments?: string;
}

export class IncidentService {
  private incidentModel: typeof Incident;

  constructor(incidentModel: typeof Incident) {
    this.incidentModel = incidentModel;
  }

  async create(data: CreateIncidentDTO): Promise<Incident> {
    const incidentData: IncidentCreationAttributes = {
      ...data,
      status: data.status || 'open'
    };
    
    return await this.incidentModel.create(incidentData);
  }

  async findAll(filters: Partial<IncidentAttributes> = {}): Promise<Incident[]> {
    return await this.incidentModel.findAll({
      where: filters
    });
  }

  async findById(id: number): Promise<Incident | null> {
    return await this.incidentModel.findByPk(id);
  }

  async update(id: number, data: UpdateIncidentDTO): Promise<[number, Incident[]]> {
    return await this.incidentModel.update(data, {
      where: { id },
      returning: true
    });
  }

  async delete(id: number): Promise<number> {
    return await this.incidentModel.destroy({
      where: { id }
    });
  }

  async getStats(): Promise<{
    total: number;
    byPriority: Record<'low' | 'medium' | 'high' | 'critical', number>;
    byStatus: Record<'open' | 'resolved' | 'high' | 'critical', number>;
  }> {
    const total = await this.incidentModel.count();
    
    const [byPriority, byStatus] = await Promise.all([
      sequelize.query<{
        urgency: 'low' | 'medium' | 'high' | 'critical';
        count: number;
      }>(
        'SELECT urgency, COUNT(*) as count FROM incidents GROUP BY urgency',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<{
        status: 'open' | 'resolved' | 'high' | 'critical';
        count: number;
      }>(
        'SELECT status, COUNT(*) as count FROM incidents GROUP BY status',
        { type: QueryTypes.SELECT }
      )
    ]);

    // Initialiser les maps avec les valeurs par défaut
    const priorityMap: Record<'low' | 'medium' | 'high' | 'critical', number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    const statusMap: Record<'open' | 'resolved' | 'high' | 'critical', number> = {
      open: 0,
      resolved: 0,
      high: 0,
      critical: 0
    };

    // Remplir les maps avec les données
    byPriority.forEach(row => {
      priorityMap[row.urgency] = row.count;
    });

    byStatus.forEach(row => {
      statusMap[row.status] = row.count;
    });

    return {
      total,
      byPriority: priorityMap,
      byStatus: statusMap
    };
  }
}

export default new IncidentService(Incident);
