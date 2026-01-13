import { ReviewService } from "../services/reviewService.js";

const reviewService = new ReviewService();

export class ReviewController {
    constructor() {
        this.create = this.create.bind(this);
        this.getByCar = this.getByCar.bind(this);
        this.getCommonFaults = this.getCommonFaults.bind(this);
        this.toggleReaction = this.toggleReaction.bind(this);
        this.report = this.report.bind(this);
        this.getReported = this.getReported.bind(this);
        this.delete = this.delete.bind(this);
        this.dismissReport = this.dismissReport.bind(this);
        this.deleteReviewFromReport = this.deleteReviewFromReport.bind(this);
    }

    async create(req, res) {
        try {
            console.log('Review creation request body:', req.body);
            console.log('User from token:', req.user);

            const { failureTags, photos, car_id, ...reviewData } = req.body;
            // Asignar el usuario del token al review y mapear car_id
            const data = {
                ...reviewData,
                user: { id: req.user.id },
                car: { id: car_id }
            };

            console.log('Data to create review:', data);
            console.log('Failure tags:', failureTags);
            console.log('Photos:', photos);

            const review = await reviewService.create(data, failureTags, photos);
            res.status(201).json(review);
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getByCar(req, res) {
        try {
            const userId = req.user ? req.user.id : null;
            const reviews = await reviewService.findByCarId(req.params.carId, userId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCommonFaults(req, res) {
        try {
            const faults = await reviewService.getCommonFaults(req.params.carId);
            res.json(faults);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async toggleReaction(req, res) {
        try {
            const { reviewId } = req.params;
            const { type } = req.body; // 'LIKE' or 'DISLIKE'
            const result = await reviewService.toggleReaction(reviewId, req.user.id, type);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async report(req, res) {
        try {
            const { reviewId } = req.params;
            const { reason, details } = req.body;
            const report = await reviewService.reportReview(reviewId, req.user.id, reason, details);
            res.status(201).json(report);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReported(req, res) {
        try {
            const reports = await reviewService.findReported();
            res.json(reports);
        } catch (error) {
            console.error('Error getting reports:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const isAdmin = req.user.role === 'admin';

            const result = await reviewService.delete(id, userId, isAdmin);
            res.json(result);
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async dismissReport(req, res) {
        try {
            const { reportId } = req.params;
            const result = await reviewService.dismissReport(reportId);
            res.json(result);
        } catch (error) {
            console.error('Error dismissing report:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReviewFromReport(req, res) {
        try {
            const { reportId } = req.params;
            const result = await reviewService.deleteReviewFromReport(reportId);
            res.json(result);
        } catch (error) {
            console.error('Error deleting review from report:', error);
            res.status(400).json({ message: error.message });
        }
    }
}
