import { DataSource } from 'typeorm';
import { envs } from './configEnv.js';

// entidades
import { User } from '../entities/User.js';
import { Car } from '../entities/Car.js';
import { Photo } from '../entities/Photo.js';
import { Review } from '../entities/Review.js';
import { FailureTag } from '../entities/FailureTag.js';
import { Review_Reaction } from '../entities/Review_Reaction.js';
import { Review_Report } from '../entities/Review_Report.js';
import { Feedback } from '../entities/Feedback.js';
import { Favorite_Car } from '../entities/Favorite_Car.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUser,
  password: envs.dbPassword,
  database: envs.dbName,

  synchronize: true, // crea tablas automaticamente
  logging: false,     // sql en consola
  
  entities: [
    User,
    Car,
    Photo,
    Review,
    FailureTag,
    Review_Reaction,
    Review_Report,
    Feedback,
    Favorite_Car
  ],
  
  subscribers: [],
  migrations: [],
});