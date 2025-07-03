import { sequelize } from '../config/database';

async function testDatabaseConnection() {
    try {
        console.log('Attempting to connect to database...');
        console.log('Database configuration:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER
        });

        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Vérifier que la base de données existe
        console.log('Checking available databases...');
        const [databases] = await sequelize.query('SHOW DATABASES');
        console.log('Available databases:', databases);
        
        // Vérifier que la table existe
        console.log('Checking available tables...');
        const [tables] = await sequelize.query('SHOW TABLES');
        console.log('Available tables:', tables);
        
        // Vérifier la création d'un incident
        console.log('Testing incident creation...');
        const testIncident = {
            description: 'Test incident',
            urgency: 'high',
            location: 'Test location',
            reportedBy: 'Test user'
        };
        
        try {
            const incident = await sequelize.models.Incident.create(testIncident);
            console.log('Incident created successfully:', incident.toJSON());
            
            // Supprimer l'incident de test
            await incident.destroy();
        } catch (error) {
            console.error('Error creating test incident:', error);
        }
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
        }
    }
}

testDatabaseConnection();
