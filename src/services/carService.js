import { AppDataSource } from "../config/configDB.js";
import { Car } from "../entities/Car.js";

export class CarService {
    constructor() {
        this.carRepository = AppDataSource.getRepository(Car);
    }

    async create(carData) {
        // Asignar el objeto usuario si viene el ID
        if (carData.createdBy) {
            carData.createdBy = { id: carData.createdBy };
        }
        const car = this.carRepository.create(carData);
        return await this.carRepository.save(car);
    }

    async findAll() {
        return await this.carRepository.find({
            relations: ["photos", "reviews", "createdBy"],
            order: { created_at: "DESC" }
        });
    }

    async findById(id) {
        return await this.carRepository.findOne({
            where: { id },
            relations: ["photos", "reviews", "reviews.user"]
        });
    }

    async update(id, carData) {
        const car = await this.findById(id);
        if (!car) {
            return null;
        }

        // Update car properties
        Object.assign(car, carData);
        return await this.carRepository.save(car);
    }

    async delete(id) {
        const car = await this.findById(id);
        if (!car) {
            return null;
        }

        await this.carRepository.remove(car);
        return true;
    }

    async getPopularCars(limit = 3) {
        // Step 1: Get IDs of cars ordered by review count
        // We need to be careful with GROUP BY in Postgres
        const popularIds = await this.carRepository
            .createQueryBuilder("car")
            .leftJoin("car.reviews", "reviews")
            .select("car.id", "id")
            .addSelect("COUNT(reviews.id)", "reviewCount")
            .groupBy("car.id")
            .orderBy('"reviewCount"', "DESC") // Quote the alias for Postgres
            .limit(limit)
            .getRawMany();

        if (!popularIds || popularIds.length === 0) {
            // Fallback: If no reviews, just return the latest cars
            return await this.carRepository.find({
                take: limit,
                relations: ["photos", "reviews"],
                order: { created_at: "DESC" }
            });
        }

        const ids = popularIds.map(p => p.id);

        // Step 2: Fetch full car entities for these IDs
        const cars = await this.carRepository
            .createQueryBuilder("car")
            .leftJoinAndSelect("car.photos", "photos")
            .leftJoinAndSelect("car.reviews", "reviews")
            .leftJoinAndSelect("reviews.user", "user") // Also fetch user for reviews if needed
            .where("car.id IN (:...ids)", { ids })
            .getMany();

        // Sort cars to match the order of popularIds
        // If we have fewer popular cars than the limit, fill the rest with latest cars
        let sortedCars = ids.map(id => cars.find(car => car.id === id)).filter(Boolean);

        if (sortedCars.length < limit) {
            const existingIds = sortedCars.map(c => c.id);
            const additionalCars = await this.carRepository.find({
                where: {
                    // We can't easily do NOT IN with empty array in TypeORM, so we fetch more and filter in JS or use a smart query
                    // For simplicity, let's just fetch latest and filter
                },
                relations: ["photos", "reviews"],
                order: { created_at: "DESC" },
                take: limit + existingIds.length
            });

            const newCars = additionalCars.filter(c => !existingIds.includes(c.id));
            sortedCars = [...sortedCars, ...newCars].slice(0, limit);
        }

        return sortedCars;
    }
    async findByMakeAndModel(make, model, currentId) {
        return await this.carRepository
            .createQueryBuilder("car")
            .select(["car.id", "car.year", "car.version"])
            .where("LOWER(car.make) = LOWER(:make)", { make })
            .andWhere("LOWER(car.model) = LOWER(:model)", { model })
            .andWhere("car.id != :currentId", { currentId })
            .orderBy("car.year", "DESC")
            .getMany();
    }
}

