import { AppDataSource } from '../config/configDB.js';
import { Favorite_Car } from '../entities/Favorite_Car.js';

export class FavoriteService {
    constructor() {
        this.favoriteRepository = AppDataSource.getRepository(Favorite_Car);
    }

    async addFavorite(userId, carId) {
        // Check if already exists
        const existing = await this.favoriteRepository.findOne({
            where: { user_id: userId, car_id: carId }
        });

        if (existing) {
            throw new Error('Car is already in favorites');
        }

        const favorite = this.favoriteRepository.create({
            user_id: userId,
            car_id: carId
        });

        return await this.favoriteRepository.save(favorite);
    }

    async removeFavorite(userId, carId) {
        const result = await this.favoriteRepository.delete({
            user_id: userId,
            car_id: carId
        });

        if (result.affected === 0) {
            throw new Error('Favorite not found');
        }

        return { message: 'Favorite removed successfully' };
    }

    async getUserFavorites(userId) {
        const favorites = await this.favoriteRepository.find({
            where: { user_id: userId },
            relations: ['car'],
            order: { created_at: 'DESC' }
        });

        return favorites.map(fav => fav.car);
    }

    async checkIfFavorite(userId, carId) {
        const favorite = await this.favoriteRepository.findOne({
            where: { user_id: userId, car_id: carId }
        });

        return { isFavorite: !!favorite };
    }
}
