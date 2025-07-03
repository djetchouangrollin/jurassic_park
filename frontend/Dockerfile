# Étape 1 : Compile le TypeScript + copie les fichiers HTML/CSS
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les sources
COPY . .

# Compiler les fichiers TypeScript
RUN npx tsc

# Préparer les fichiers à servir avec Nginx
RUN mkdir -p dist && \
    cp src/*.html dist/ && \
    cp src/*.css dist/

# Étape 2 : Utilise nginx pour servir le frontend
FROM nginx:alpine

# Copier les fichiers générés vers nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
