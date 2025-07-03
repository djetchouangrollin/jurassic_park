import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/config';
import incidentRoutes from './routes/incidentRoutes';
import { initDatabase } from './database/init';

const app = express();

async function initializeApp() {
    try {
        // Initialiser la base de données
        await initDatabase();

        // Middleware
        app.use(cors({ origin: config.CORS_ORIGIN }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: Number(config.RATE_LIMIT_WINDOW) * 60 * 1000,
            max: Number(config.RATE_LIMIT_MAX),
            message: 'Too many requests from this IP, please try again later.'
        });
        app.use(limiter);

        // Swagger configuration
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Jurassic Park Incident Tracker API',
                    version: '1.0.0',
                    description: 'API for tracking incidents in Jurassic Park'
                },
                servers: [
                    {
                        url: `http://localhost:${config.PORT}`,
                        description: 'Local server'
                    }
                ]
            },
            apis: [process.env.NODE_ENV === 'production' ? './dist/routes/*.js' : './src/routes/*.ts']
        };

        const specs = swaggerJsdoc(swaggerOptions);
        app.use(config.SWAGGER_API_URL, swaggerUi.serve, swaggerUi.setup(specs));

        // Route de base pour tester la connexion
        app.get('/', (req: Request, res: Response) => {
            res.json({
                message: 'Bienvenue sur l\'API du Tracker d\'Incidents de Jurassic Park',
                status: 'OK',
                timestamp: new Date().toISOString()
            });
        });

        // Routes
        app.use('/api/incidents', incidentRoutes);

        // Error handling
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });

        // Démarrer le serveur
        const PORT = Number(config.PORT);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'application:', error);
        process.exit(1);
    }
}

// Initialiser l'application
initializeApp().catch(console.error);
