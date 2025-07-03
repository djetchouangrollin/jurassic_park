import { Request, Response } from 'express';
import { IncidentService } from '../services/incidentService';
import { Incident } from '../models/incident';

class IncidentController {
  private incidentService: IncidentService;

  constructor(incidentService: IncidentService) {
    this.incidentService = incidentService;
  }

  async create(req: Request, res: Response) {
    try {
      const incident = await this.incidentService.create(req.body);
      res.status(201).json(incident);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const incident = await this.incidentService.findById(parseInt(req.params.id));
      if (!incident) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.json(incident);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const incidents = await this.incidentService.findAll();
      res.json(incidents);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const [updated, [incident]] = await this.incidentService.update(id, req.body);
      if (updated === 0) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.json(incident);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async resolve(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const resolutionData = req.body;
      
      // Ajouter la date de résolution si non spécifiée
      if (!resolutionData.resolvedAt) {
        resolutionData.resolvedAt = new Date();
      }
      
      const [updated, [incident]] = await this.incidentService.update(id, {
        status: 'resolved',
        ...resolutionData
      });
      
      if (updated === 0) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.json(incident);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const statusData = req.body;
      
      const [updated, [incident]] = await this.incidentService.update(id, {
        status: statusData.status,
        statusComments: statusData.comments
      });
      
      if (updated === 0) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.json(incident);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await this.incidentService.getStats();
      res.json(stats);
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.incidentService.delete(id);
      if (deleted === 0) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.status(204).send();
    } catch (error: unknown) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }
}

export default IncidentController;
