# Architecture AWS pour Jurassic Park Incident Tracker

## Architecture Générale

L'application est déployée sur AWS avec une architecture haute disponibilité et sécurisée.

### Zones de Disponibilité
- 3 zones de disponibilité (AZ) pour chaque service
- Réplication des données à travers les AZ
- Load Balancer Application (ALB) avec failover

### Services Utilisés
- **EKS (Elastic Kubernetes Service)**
  - 3 worker nodes dans chaque AZ
  - Auto-scaling group pour les nodes
  - IAM roles pour le service

- **RDS (MySQL)**
  - Instance MySQL 8.x
  - Multi-AZ deployment
  - Backup automatique quotidien
  - Volume de 5GiB minimum

- **VPC**
  - 3 subnets publics (1 par AZ)
  - 3 subnets privés (1 par AZ)
  - NAT Gateway pour les instances privées
  - Sécurité réseau via Security Groups

### Sécurité
- Ségrégation réseau (public/private)
- Sécurité groupes (Security Groups)
- IAM roles et permissions strictes
- Encryption des données en transit et au repos

## Coûts Estimés (par mois)

### Infrastructure
- EKS (3 worker nodes t3.medium) : ~$135
- RDS MySQL (db.t3.small) : ~$45
- VPC et Networking : ~$10
- ALB : ~$20
- Storage (5GiB) : ~$1

### Total Estimé : ~$211/mois

## Architecture Haute Disponibilité

- **Frontend**
  - Déployé sur EKS avec 3 réplicas
  - Load balancing via ALB
  - Auto-scaling basé sur CPU/memory

- **Backend**
  - Déployé sur EKS avec 3 réplicas
  - Load balancing via Kubernetes Service
  - Auto-scaling basé sur les métriques

- **Base de données**
  - Instance RDS Multi-AZ
  - Backup automatique
  - Read Replicas possibles

## Sécurité et Monitoring

### Sécurité
- **Network Security**
  - Security Groups stricts
  - NACL (Network ACL) configurés
  - Traffic monitoring

- **Application Security**
  - Secrets via AWS Secrets Manager
  - IAM roles et permissions
  - WAF (Web Application Firewall)

### Monitoring
- **CloudWatch**
  - Métriques CPU/Memory
  - Logs centralisés
  - Alarms configurés

- **Health Checks**
  - ALB health checks
  - Kubernetes readiness/liveness probes
  - RDS monitoring

## Procédures de Maintenance

### Mises à jour
- **Kubernetes**
  - Rolling updates configurés
  - Blue/Green deployments possibles
  - Versioning des déploiements

- **Base de données**
  - Maintenance windows configurés
  - Backups automatiques
  - Read Replicas pour maintenance

### Sauvegardes
- **Automatiques**
  - RDS : quotidien
  - EKS : via EBS snapshots
  - Configurations : via S3

- **Manuelles**
  - Base de données
  - Configurations
  - Secrets

## Procédures de Disaster Recovery

1. **Cas de panne ALB**
   - Route53 failover
   - Backup ALB configuration

2. **Cas de panne RDS**
   - Multi-AZ failover
   - Backup restoration
   - Read Replicas promotion

3. **Cas de panne EKS**
   - Auto-scaling group
   - Backup configurations
   - Node replacement

## Documentation Technique

### Diagrammes
- Architecture réseau
- Flux de données
- Sécurité réseau
- Monitoring setup

### Procédures
- Mises à jour
- Sauvegardes
- Disaster recovery
- Maintenance

### Contacts
- DevOps team
- Security team
- Support AWS
