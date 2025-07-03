import { sequelize } from '../config/database';
import { Incident } from '../models/incident';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

export async function initDatabase() {
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
        try {
            // Tester la connexion
            await sequelize.authenticate();
            console.log('Connexion à la base de données établie avec succès');

            // Synchroniser toutes les tables
            await sequelize.sync({ alter: true });
            console.log('Base de données initialisée avec succès');
            return;
        } catch (error: unknown) {
            console.error(`Tentative ${retryCount + 1}/${MAX_RETRIES} - Erreur de connexion:`, 
                error instanceof Error ? error.message : 'Erreur inconnue');
            retryCount++;

            if (retryCount === MAX_RETRIES) {
                console.error('Toutes les tentatives de connexion ont échoué');
                throw error;
            }

            console.log(`Réessayer dans ${RETRY_DELAY/1000} secondes...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}
