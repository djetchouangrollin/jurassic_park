import express, { Router } from 'express';
import IncidentController from '../controllers/incidentController';
import { IncidentService } from '../services/incidentService';
import { Incident } from '../models/incident';

const router = Router();
const incidentService = new IncidentService(Incident);
const incidentController = new IncidentController(incidentService);

// Routes des incidents
router.post('/', incidentController.create.bind(incidentController));

// ✅ Les routes spécifiques d'abord
router.get('/stats', incidentController.getStats.bind(incidentController));

// ✅ Puis les routes générales
router.get('/', incidentController.getAll.bind(incidentController));
router.get('/:id', incidentController.get.bind(incidentController));
router.put('/:id', incidentController.update.bind(incidentController));
router.put('/:id/resolve', incidentController.resolve.bind(incidentController));
router.put('/:id/status', incidentController.updateStatus.bind(incidentController));
router.delete('/:id', incidentController.delete.bind(incidentController));

export default router;
