// Configuration
const API_BASE_URL = 'http://localhost:3002';

// Classe pour gérer les incidents
class IncidentTracker {
    constructor() {
        this.loading = false;
        this.modal = null;
        this.initEventListeners();
        this.loadIncidents();
    }

    // Initialisation des écouteurs d'événements
    initEventListeners() {
        // Filtres
        const statusFilter = document.getElementById('filterStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.loadIncidents());
        }

        const priorityFilter = document.getElementById('filterPriority');
        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => this.loadIncidents());
        }

        // Création
        const createButton = document.getElementById('submitCreate');
        if (createButton) {
            createButton.addEventListener('click', () => this.createIncident());
        }

        // Mise à jour
        const updateButton = document.getElementById('submitUpdate');
        if (updateButton) {
            updateButton.addEventListener('click', () => this.updateIncident());
        }
    }

    // Chargement des incidents
    async loadIncidents() {
        if (this.loading) return;
        this.loading = true;

        try {
            const status = document.getElementById('filterStatus')?.value || '';
            const urgency = document.getElementById('filterPriority')?.value || '';

            const response = await fetch(`${API_BASE_URL}/api/incidents?status=${encodeURIComponent(status)}&urgency=${encodeURIComponent(urgency)}`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`Erreur API (${response.status}): ${errorText}`);
            }

            try {
                const incidents = await response.json();
                console.log('Incidents received:', incidents);
                
                if (!Array.isArray(incidents)) {
                    console.error('La réponse n\'est pas un tableau:', incidents);
                    throw new Error('La réponse du backend n\'est pas un tableau valide');
                }
                
                this.displayIncidents(incidents);
            } catch (parseError) {
                console.error('Erreur de parsing JSON:', parseError);
                const text = await response.text();
                console.error('Texte brut de la réponse:', text);
                throw new Error(`Erreur de parsing JSON: ${parseError.message}`);
            }
        } catch (error) {
            this.showError(error.message || 'Erreur lors du chargement des incidents');
        } finally {
            this.loading = false;
        }
    }

    // Affichage des incidents
    displayIncidents(incidents) {
        console.log('Displaying incidents:', incidents);
        
        const tbody = document.getElementById('incidentsTableBody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }

        tbody.innerHTML = '';
        
        if (!incidents) {
            console.error('No incidents data');
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-3">Erreur: Pas de données d\'incidents</td></tr>';
            return;
        }

        if (!Array.isArray(incidents)) {
            console.error('Invalid data format:', incidents);
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-3">Erreur: Format de données invalide</td></tr>';
            return;
        }

        if (incidents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-3">Aucun incident trouvé</td></tr>';
            return;
        }

        incidents.forEach(incident => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${incident.title}</td>
                <td><span class="badge bg-secondary">${incident.type}</span></td>
                <td><span class="badge bg-${this.getUrgencyColor(incident.urgency)}">${incident.urgency}</span></td>
                <td><span class="badge bg-${this.getStatusColor(incident.status)}">${incident.status}</span></td>
                <td>${incident.location}</td>
                <td>${incident.description}</td>
                <td>${incident.reportedBy}</td>
                <td>${incident.createdAt.toLocaleString()}</td>
                <td>${incident.resolvedAt ? incident.resolvedAt.toLocaleString() : ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#updateIncidentModal" onclick="incidentTracker.showUpdateModal(${JSON.stringify(incident)})">
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

    // Création d'un incident
    async createIncident() {
        const form = document.getElementById('createIncidentForm');
        if (!form) return;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Adapter les données pour correspondre au backend
            data.urgency = data.priority;
            delete data.priority;
            data.reportedBy = 'John Hammond'; // À remplacer par l'utilisateur actuel
            
            const response = await fetch(`${API_BASE_URL}/api/incidents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log('Response status:', response.status);
            console.log('Response data:', await response.json());

            if (!response.ok) throw new Error(`Erreur API (${response.status}): ${await response.text()}`);

            // Fermer la modale avec Bootstrap
            const modal = bootstrap.Modal.getInstance(document.getElementById('createIncidentModal'));
            if (modal) {
                modal.hide();
            }
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Recharger la liste
            this.loadIncidents();
            
            // Afficher le message de succès
            this.showSuccess('Incident créé avec succès');
            
            // Ajouter un petit délai pour s'assurer que tout est bien fermé
            setTimeout(() => {
                document.body.classList.remove('modal-open');
                document.querySelector('.modal-backdrop')?.remove();
            }, 200);
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la création de l\'incident');
        }
    }

    // Affichage de la modale de mise à jour
    showUpdateModal(incident) {
        console.log('Showing update modal for incident:', incident);
        
        if (!incident || typeof incident.id !== 'number') {
            console.error('Invalid incident data:', incident);
            return;
        }

        const form = document.getElementById('updateIncidentForm');
        if (!form) {
            console.error('Update form not found');
            return;
        }

        // Remplir le formulaire
        form.id.value = incident.id;
        console.log('Setting form ID:', form.id.value);
        form.status.value = incident.status || 'open';
        form.comment.value = incident.statusComments || '';

        // Ouvrir la modale
        const modalElement = document.getElementById('updateIncidentModal');
        if (!modalElement) {
            console.error('Modal element not found');
            return;
        }

        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.show();
    }

    // Mise à jour d'un incident
    async updateIncident() {
        const form = document.getElementById('updateIncidentForm');
        if (!form) return;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Adapter les données pour correspondre au backend
            data.statusComments = data.comment;
            delete data.comment;
            
            // Vérifier que nous avons un ID valide
            const id = formData.get('id');
            if (!id) {
                throw new Error('ID de l\'incident non trouvé');
            }
            
            const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Erreur API (${response.status}): ${await response.text()}`);

            // Fermer la modale et recharger la liste
            const modal = bootstrap.Modal.getInstance(document.getElementById('updateIncidentModal'));
            modal.hide();
            form.reset();
            this.loadIncidents();
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la mise à jour de l\'incident');
        }
    }

    // Suppression d'un incident
    async deleteIncident(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Erreur API (${response.status}): ${await response.text()}`);

            this.loadIncidents();
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la suppression de l\'incident');
        }
    }

    // Affichage d'un message de succès
    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success fade-in';
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Supprimer l'alerte après 5 secondes
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    // Affichage d'un message d'erreur
    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger fade-in';
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Supprimer l'alerte après 5 secondes
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    // Récupération de la couleur pour une urgence
    getUrgencyColor(urgency) {
        const colors = {
            low: 'success',
            medium: 'warning',
            high: 'danger',
            critical: 'danger'
        };
        return colors[urgency] || 'secondary';
    }

    // Récupération de la couleur pour un statut
    getStatusColor(status) {
        const colors = {
            open: 'secondary',
            resolved: 'success',
            high: 'warning',
            critical: 'danger'
        };
        return colors[status] || 'secondary';
    }
}

// Initialisation de l'application
const incidentTracker = new IncidentTracker();
