# Incident Tracker - Jurassic Park

Application de gestion d'incidents pour le parc Jurassic Park

## 🚀 Présentation

Cette application permet aux équipes de Jurassic Park (rangers et techniciens) de gérer les incidents survenus dans le parc. Elle offre une interface web simple et une API REST sécurisée.

## 📋 Fonctionnalités

- Gestion complète des incidents (CRUD)
- Interface utilisateur responsive
- Authentification sécurisée
- Documentation Swagger
- Architecture containerisée et Kubernetes-ready
- CI/CD automatisé

## 🛠️ Stack Technique

### Frontend
- HTML/CSS/JS Vanilla
- Bootstrap pour le responsive design
- Architecture MVC légère

### Backend
- Node.js + Express
- MySQL via Sequelize
- REST API bien structurée
- Tests unitaires et d'intégration

### DevOps
- CI/CD avec GitHub Actions
- Docker pour le containerisation
- Kubernetes pour l'orchestration
- AWS pour le déploiement en production

## 📁 Structure du Projet

```
incident-tracker-jurassic-park/
├── backend/              # Backend Node.js
├── frontend/             # Frontend web
├── docker/              # Fichiers Docker
├── k8s/                 # Manifests Kubernetes
├── docs/                # Documentation
└── tests/              # Tests unitaires et d'intégration
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 20.x
- MySQL 8.x
- Docker & Docker Compose
- kubectl (pour Kubernetes)

### Installation locale

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Lancement en développement

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## 📄 Documentation

- [Documentation Docker](docs/README_DOCKER.md)
- [Documentation Kubernetes](docs/README_K8S.md)
- [Documentation AWS](docs/aws-documentation.md)
- [API Documentation](docs/swagger.yaml)

## 🔒 Sécurité

- Authentification JWT
- Validation des entrées
- Protection contre les injections SQL
- Scan de sécurité avec Trivy

## 📈 Tests

- Tests unitaires
- Tests d'intégration
- Couverture minimale : 70%

## 🤝 Contributing

Les contributions sont les bienvenues ! Veuillez lire notre [guide de contribution](CONTRIBUTING.md) pour plus d'informations.

## 📝 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.
