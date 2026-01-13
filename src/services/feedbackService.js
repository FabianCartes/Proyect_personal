import { AppDataSource } from "../config/configDB.js";
import { Feedback } from "../entities/Feedback.js";

export class FeedbackService {
    constructor() {
        this.feedbackRepository = AppDataSource.getRepository(Feedback);
    }

    async create(feedbackData) {
        const feedback = this.feedbackRepository.create(feedbackData);
        return await this.feedbackRepository.save(feedback);
    }

    async findAll() {
        return await this.feedbackRepository.find({
            relations: ["user"],
            order: { created_at: "DESC" }
        });
    }

    async delete(id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            return null;
        }
        await this.feedbackRepository.remove(feedback);
        return true;
    }
}
