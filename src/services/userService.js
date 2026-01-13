import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/User.js";
import { Review } from "../entities/Review.js";
import { Favorite_Car } from "../entities/Favorite_Car.js";
import { Review_Reaction } from "../entities/Review_Reaction.js";

export class UserService {
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.reviewRepository = AppDataSource.getRepository(Review);
        this.favoriteRepository = AppDataSource.getRepository(Favorite_Car);
        this.reactionRepository = AppDataSource.getRepository(Review_Reaction);
    }

    async create(userData) {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async findByEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findAll() {
        return await this.userRepository.find({
            order: { created_at: "DESC" }
        });
    }

    async getProfileStats(userId) {
        // Count user's reviews
        const reviewsCount = await this.reviewRepository.count({
            where: { user: { id: userId } }
        });

        // Count user's favorites
        const favoritesCount = await this.favoriteRepository.count({
            where: { user: { id: userId } }
        });

        // Count likes received on user's reviews
        const userReviews = await this.reviewRepository.find({
            where: { user: { id: userId } },
            select: ['id']
        });

        const reviewIds = userReviews.map(r => r.id);

        let likesCount = 0;
        if (reviewIds.length > 0) {
            const { In } = await import('typeorm');
            likesCount = await this.reactionRepository.count({
                where: {
                    review: { id: In(reviewIds) },
                    reactionType: 'LIKE'
                }
            });
        }

        return {
            reviewsCount,
            favoritesCount,
            likesCount
        };
    }

    async getProfileReviews(userId) {
        return await this.reviewRepository.find({
            where: { user: { id: userId } },
            relations: ["car", "failureTags", "photos", "reactions"],
            order: { created_at: "DESC" }
        });
    }

    async getPublicProfileStats(userId) {
        // Same as getProfileStats but for public access
        return await this.getProfileStats(userId);
    }
}
