import { FavoriteService } from '../services/favoriteService.js';

const favoriteService = new FavoriteService();

export class FavoriteController {
    async addFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { carId } = req.body;

            if (!carId) {
                return res.status(400).json({ message: 'Car ID is required' });
            }

            const favorite = await favoriteService.addFavorite(userId, carId);
            res.status(201).json(favorite);
        } catch (error) {
            if (error.message === 'Car is already in favorites') {
                return res.status(409).json({ message: error.message });
            }
            console.error('Error adding favorite:', error);
            res.status(500).json({ message: 'Error adding favorite' });
        }
    }

    async removeFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { carId } = req.params;

            const result = await favoriteService.removeFavorite(userId, parseInt(carId));
            res.json(result);
        } catch (error) {
            if (error.message === 'Favorite not found') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Error removing favorite:', error);
            res.status(500).json({ message: 'Error removing favorite' });
        }
    }

    async getUserFavorites(req, res) {
        try {
            const userId = req.user.id;
            const favorites = await favoriteService.getUserFavorites(userId);
            res.json(favorites);
        } catch (error) {
            console.error('Error getting favorites:', error);
            res.status(500).json({ message: 'Error getting favorites' });
        }
    }

    async checkIfFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { carId } = req.params;

            const result = await favoriteService.checkIfFavorite(userId, parseInt(carId));
            res.json(result);
        } catch (error) {
            console.error('Error checking favorite:', error);
            res.status(500).json({ message: 'Error checking favorite' });
        }
    }
}
