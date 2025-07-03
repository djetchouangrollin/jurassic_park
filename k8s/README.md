# Configuration Kubernetes

Cette section contient la configuration Kubernetes pour déployer l'application Incident Tracker de Jurassic Park.

## Structure des fichiers

```
k8s/
├── deployments/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── mysql-deployment.yaml
├── services/
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   └── mysql-service.yaml
├── configmaps/
│   ├── frontend-configmap.yaml
│   └── backend-configmap.yaml
├── secrets/
│   ├── mysql-secret.yaml
│   └── jwt-secret.yaml
├── storage/
│   └── mysql-pvc.yaml
└── ingress/
    └── frontend-ingress.yaml
```

## Déploiement

Pour déployer l'application, exécutez les commandes suivantes dans l'ordre :

```bash
# Créer le namespace
kubectl create namespace jurassic-park

# Déployer les secrets
kubectl apply -f secrets/ -n jurassic-park

# Déployer les configmaps
kubectl apply -f configmaps/ -n jurassic-park

# Déployer les volumes persistants
kubectl apply -f storage/ -n jurassic-park

# Déployer les services
kubectl apply -f services/ -n jurassic-park

# Déployer les déploiements
kubectl apply -f deployments/ -n jurassic-park

# Déployer l'ingress (si configuré)
kubectl apply -f ingress/ -n jurassic-park
```

## Configuration

Les configurations principales sont stockées dans les fichiers suivants :

- `mysql-secret.yaml` : Contient les informations d'authentification MySQL
- `jwt-secret.yaml` : Contient la clé secrète JWT
- `frontend-configmap.yaml` : Configuration du frontend
- `backend-configmap.yaml` : Configuration du backend
- `mysql-pvc.yaml` : Volume persistant pour MySQL (5Gi minimum)

## Monitoring et Logging

L'application est configurée pour utiliser les logs standard de Kubernetes. Les logs peuvent être consultés avec :

```bash
kubectl logs -f <pod-name> -n jurassic-park
```

## Sécurité

- Les secrets sont stockés dans des Kubernetes Secrets
- Les configurations sensibles sont masquées
- Les volumes persistants sont configurés avec des permissions appropriées
- Les déploiements sont configurés avec des ressources limitées

## Mise à jour

Pour mettre à jour l'application :

```bash
# Mettre à jour les images
kubectl set image deployment/<deployment-name> <container-name>=<new-image> -n jurassic-park

# Mettre à jour les configurations
kubectl apply -f configmaps/ -n jurassic-park
```

## Sauvegarde

Les données MySQL sont stockées dans un PVC persistant. Pour sauvegarder les données :

```bash
# Sauvegarder les données MySQL
kubectl exec -it <mysql-pod> -n jurassic-park -- mysqldump -u root -p<password> jurassic_park > backup.sql

# Sauvegarder le PVC
kubectl get pvc -n jurassic-park
```

## Documentation

Pour plus d'informations sur la configuration de chaque composant, consultez les fichiers YAML individuels.
