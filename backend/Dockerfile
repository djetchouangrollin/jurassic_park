FROM node:20-alpine AS builder

WORKDIR /app

# Copier les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Stage de production
FROM node:20-alpine

WORKDIR /app

# Copier les dépendances de production
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copier le code compilé
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copier les fichiers statiques
COPY --from=builder /app/public ./public

# Copier le fichier .env
COPY .env .

# Configuration via variables d'environnement
ENV PORT=3002
ENV NODE_ENV=development
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_NAME=jurassic_park
ENV DB_USER=root
ENV DB_PASSWORD=root
ENV JWT_SECRET=root
ENV JWT_EXPIRES_IN=24h
ENV SWAGGER_API_URL=/api-docs
ENV TEST_DB_NAME=jurassic_park_test
ENV RATE_LIMIT_WINDOW=15
ENV RATE_LIMIT_MAX=100
ENV CORS_ORIGIN=http://localhost:3001
ENV DOCKER_NODE_VERSION=20-alpine

# Exposer le port
EXPOSE 3002

# Commande de démarrage
CMD ["npm", "start"]
