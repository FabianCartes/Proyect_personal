import { UserService } from "../services/userService.js";

const userService = new UserService();

export class UserController {
    async getProfile(req, res) {
        try {
            const user = await userService.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            // No devolver password
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await userService.findAll();
            // Remove passwords
            const safeUsers = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.json(safeUsers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            // No devolver password
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProfileStats(req, res) {
        try {
            const stats = await userService.getProfileStats(req.user.id);
            res.json(stats);
        } catch (error) {
            console.error('Error getting profile stats:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getProfileReviews(req, res) {
        try {
            const reviews = await userService.getProfileReviews(req.user.id);

            // Process reactions for frontend (similar to review service)
            const processedReviews = reviews.map(review => {
                const likes = review.reactions.filter(r => r.reactionType === 'LIKE').length;
                const dislikes = review.reactions.filter(r => r.reactionType === 'DISLIKE').length;

                const { reactions, ...reviewData } = review;
                return {
                    ...reviewData,
                    likes,
                    dislikes,
                    userReaction: null // User is viewing their own reviews
                };
            });

            res.json(processedReviews);
        } catch (error) {
            console.error('Error getting profile reviews:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getPublicProfileStats(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const stats = await userService.getPublicProfileStats(userId);
            res.json(stats);
        } catch (error) {
            console.error('Error getting public profile stats:', error);
            res.status(500).json({ message: error.message });
        }
    }
}
