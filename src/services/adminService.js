import { AppDataSource } from "../config/configDB.js";
import { Car } from "../entities/Car.js";
import { User } from "../entities/User.js";
import { Review } from "../entities/Review.js";
import { Review_Report } from "../entities/Review_Report.js";

export class AdminService {
    constructor() {
        this.carRepository = AppDataSource.getRepository(Car);
        this.userRepository = AppDataSource.getRepository(User);
        this.reviewRepository = AppDataSource.getRepository(Review);
        this.reportRepository = AppDataSource.getRepository(Review_Report);
    }

    async getDashboardStats() {
        const totalCars = await this.carRepository.count();
        const totalUsers = await this.userRepository.count();
        const totalReviews = await this.reviewRepository.count();
        const totalReports = await this.reportRepository.count({
            where: { status: "PENDING" }
        });

        return {
            totalCars,
            totalUsers,
            totalReviews,
            totalReports
        };
    }
}
