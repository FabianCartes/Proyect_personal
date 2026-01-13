import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const favoriteController = new FavoriteController();

// All favorite routes require authentication
router.post('/', authMiddleware, (req, res) => favoriteController.addFavorite(req, res));
router.delete('/:carId', authMiddleware, (req, res) => favoriteController.removeFavorite(req, res));
router.get('/', authMiddleware, (req, res) => favoriteController.getUserFavorites(req, res));
router.get('/check/:carId', authMiddleware, (req, res) => favoriteController.checkIfFavorite(req, res));

export default router;
