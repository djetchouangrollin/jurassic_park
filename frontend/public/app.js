"use strict";
class IncidentTracker {
    constructor() {
        this.baseUrl = '/api';
        this.loading = false;
        this.modal = null;
        this.initEventListeners();
        this.loadIncidents();
        this.updateStats();
    }
    initEventListeners() {
        const createButton = document.getElementById('submitCreate');
        createButton?.addEventListener('click', () => this.createIncident());
        const updateButton = document.getElementById('submitUpdate');
        updateButton?.addEventListener('click', () => this.updateIncident());
        const statusFilter = document.getElementById('filterStatus');
        const priorityFilter = document.getElementById('filterPriority');
        statusFilter?.addEventListener('change', () => this.loadIncidents());
        priorityFilter?.addEventListener('change', () => this.loadIncidents());
    }
    async loadIncidents() {
        if (this.loading)
            return;
        this.loading = true;
        try {
            const status = document.getElementById('filterStatus')?.value || '';
            const priority = document.getElementById('filterPriority')?.value || '';
            const response = await fetch(`${this.baseUrl}/incidents?status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}`);
            if (!response.ok) {
                throw new Error(`Erreur API (${response.status}): ${await response.text()}`);
            }
            const data = await response.json();
            this.displayIncidents(data.incidents);
            this.updateStats();
        }
        catch (error) {
            console.error('Erreur lors du chargement des incidents:', error);
            this.showError(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
        finally {
            this.loading = false;
        }
    }
    displayIncidents(incidents) {
        const tbody = document.getElementById('incidentsTableBody');
        if (!tbody)
            return;
        tbody.innerHTML = '';
        incidents.forEach(incident => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${incident.title}</td>
                <td><span class="badge bg-${incident.type}">${incident.type}</span></td>
                <td><span class="badge bg-${incident.priority}">${incident.priority}</span></td>
                <td><span class="badge bg-${incident.status}">${incident.status}</span></td>
                <td>${incident.location}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="incidentTracker.showUpdateModal(${incident.id})">
                        Modifier
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="incidentTracker.deleteIncident(${incident.id})">
                        Supprimer
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    async createIncident() {
        if (this.loading)
            return;
        this.loading = true;
        try {
            const form = document.getElementById('createIncidentForm');
            if (!form)
                throw new Error('Formulaire non trouvé');
            const formData = new FormData(form);
            const data = {};
            for (const [key, value] of formData.entries()) {
                if (!value)
                    throw new Error(`Le champ ${key} ne peut pas être vide`);
                data[key] = value.toString();
            }
            const response = await fetch(`${this.baseUrl}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la création: ${await response.text()}`);
            }
            bootstrap.Modal.getInstance(document.getElementById('createIncidentModal'))?.hide();
            form.reset();
            this.loadIncidents();
        }
        catch (error) {
            console.error('Erreur lors de la création:', error);
            this.showError(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
        finally {
            this.loading = false;
        }
    }
    async updateIncident() {
        if (this.loading)
            return;
        this.loading = true;
        try {
            const form = document.getElementById('updateIncidentForm');
            if (!form)
                throw new Error('Formulaire non trouvé');
            const formData = new FormData(form);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value.toString();
            }
            if (!data.id)
                throw new Error("ID de l'incident manquant");
            const response = await fetch(`${this.baseUrl}/incidents/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour: ${await response.text()}`);
            }
            bootstrap.Modal.getInstance(document.getElementById('updateIncidentModal'))?.hide();
            form.reset();
            this.loadIncidents();
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            this.showError(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
        finally {
            this.loading = false;
        }
    }
    async deleteIncident(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet incident ?'))
            return;
        try {
            const response = await fetch(`${this.baseUrl}/incidents/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression: ${await response.text()}`);
            }
            this.loadIncidents();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showError(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
    }
    async showUpdateModal(id) {
        const form = document.getElementById('updateIncidentForm');
        if (!form)
            return;
        const incident = await this.getIncident(id);
        if (incident) {
            form.elements.namedItem('id').value = incident.id.toString();
            form.elements.namedItem('status').value = incident.status;
            form.elements.namedItem('comment').value = incident.comment || '';
        }
        const modalEl = document.getElementById('updateIncidentModal');
        let modal = bootstrap.Modal.getInstance(modalEl);
        if (!modal)
            modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
    async getIncident(id) {
        try {
            const response = await fetch(`${this.baseUrl}/incidents/${id}`);
            if (!response.ok) {
                throw new Error(`Erreur API (${response.status}): ${await response.text()}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Erreur lors de la récupération de l'incident:", error);
            return null;
        }
    }
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
    async updateStats() {
        try {
            const response = await fetch(`${this.baseUrl}/incidents/stats`);
            if (!response.ok) {
                throw new Error(`Erreur API (${response.status}): ${await response.text()}`);
            }
            const stats = await response.json();
            document.getElementById('totalIncidents').textContent = stats.total.toString();
            document.getElementById('activeIncidents').textContent = stats.active.toString();
            document.getElementById('resolvedIncidents').textContent = stats.resolved.toString();
        }
        catch (error) {
            console.error('Erreur lors de la récupération des stats:', error);
        }
    }
}
// Initialisation
const incidentTracker = new IncidentTracker();
