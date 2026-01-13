import 'reflect-metadata';
import { AppDataSource } from './config/configDB.js';
import { Car } from './entities/Car.js';
import { User } from './entities/User.js';
import { Review } from './entities/Review.js';
import { FailureTag } from './entities/FailureTag.js';
import { Photo } from './entities/Photo.js';
import { Review_Reaction } from './entities/Review_Reaction.js';
import { Review_Report } from './entities/Review_Report.js';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected for seeding...');

        // Clear existing data
        // Clear existing data (order matters due to FKs)
        await AppDataSource.getRepository(Review_Reaction).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(Review_Report).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(Photo).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(Review).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(Car).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(User).createQueryBuilder().delete().execute();
        await AppDataSource.getRepository(FailureTag).createQueryBuilder().delete().execute();

        // Create Failure Tags
        const tagsData = [
            { id: 1, name: 'Sobrecalentamiento' },
            { id: 2, name: 'Fuga de Aceite' },
            { id: 3, name: 'Ruidos Extraños' },
            { id: 4, name: 'Cambios Bruscos' },
            { id: 5, name: 'Batería' },
            { id: 6, name: 'Ruidos en Suspensión' },
            { id: 7, name: 'Desgaste Prematuro Frenos' },
            { id: 8, name: 'Pintura' },
            { id: 9, name: 'Pérdida de Potencia' },
            { id: 10, name: 'Deslizamiento' },
            { id: 11, name: 'Fuga de Líquido' },
            { id: 12, name: 'Luces' },
            { id: 13, name: 'Sensores' },
            { id: 14, name: 'Multimedia/Pantalla' },
            { id: 15, name: 'Vibraciones' },
            { id: 16, name: 'Ruidos Interiores' },
            { id: 17, name: 'Aire Acondicionado' }
        ];

        for (const tag of tagsData) {
            await AppDataSource.getRepository(FailureTag).save(tag);
        }

        // Create User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = AppDataSource.getRepository(User).create({
            email: 'test@example.com',
            password: hashedPassword,
            username: 'TestUser'
        });
        await AppDataSource.getRepository(User).save(user);

        // Create Cars
        const carsData = [
            {
                make: 'Toyota',
                model: 'Supra',
                year: 2023,
                version: 'GR 3.0',
                description: 'Legendary performance returns.',
                mainImageUrl: 'https://images.unsplash.com/photo-1605218457336-92748b9731f8?q=80&w=2000&auto=format&fit=crop',
                specs: { engine: '3.0L Inline-6', horsepower: '382 hp', transmission: '8-Speed Auto' }
            },
            {
                make: 'Ford',
                model: 'Mustang',
                year: 2024,
                version: 'Dark Horse',
                description: 'The most track-capable 5.0L Mustang.',
                mainImageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2000&auto=format&fit=crop',
                specs: { engine: '5.0L V8', horsepower: '500 hp', transmission: '6-Speed Manual' }
            },
            {
                make: 'Porsche',
                model: '911',
                year: 2023,
                version: 'GT3 RS',
                description: 'Born from racing.',
                mainImageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2000&auto=format&fit=crop',
                specs: { engine: '4.0L Flat-6', horsepower: '518 hp', transmission: '7-Speed PDK' }
            }
        ];

        const cars = [];
        for (const carData of carsData) {
            const car = AppDataSource.getRepository(Car).create(carData);
            cars.push(await AppDataSource.getRepository(Car).save(car));
        }

        // Create Review
        const review = AppDataSource.getRepository(Review).create({
            type: 'POSITIVE',
            positiveComment: 'Increíble manejo y potencia.',
            negativeComment: 'El espacio interior es reducido.',
            recommendation: 'Totalmente recomendado para pistas.',
            user: user,
            car: cars[0]
        });
        await AppDataSource.getRepository(Review).save(review);

        console.log('Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
}

seed();
