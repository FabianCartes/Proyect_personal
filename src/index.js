import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/configDB.js';
import { envs } from './config/configEnv.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import carRoutes from './routes/car.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Base de Datos conectada exitosamente!');

    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Rutas
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/cars', carRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/favorites', favoriteRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/feedback', feedbackRoutes);

    // Serve static files
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    app.get('/', (req, res) => {
      res.send('API del proyecto de autos funcionando');
    });

    app.listen(envs.appPort, () => {
      console.log(`Servidor corriendo en http://${envs.appHost}:${envs.appPort}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar la base de datos:');
    console.error(error);
  }
}

main();