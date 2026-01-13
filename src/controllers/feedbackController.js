import { FeedbackService } from "../services/feedbackService.js";

const feedbackService = new FeedbackService();

export class FeedbackController {
    async create(req, res) {
        try {
            const feedbackData = {
                ...req.body,
                user_id: req.user ? req.user.id : null // Optional user association
            };
            const feedback = await feedbackService.create(feedbackData);
            res.status(201).json(feedback);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const feedbacks = await feedbackService.findAll();
            res.json(feedbacks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await feedbackService.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Feedback no encontrado" });
            }
            res.json({ message: "Feedback eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
