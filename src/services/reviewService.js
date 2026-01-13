import { AppDataSource } from "../config/configDB.js";
import { Review } from "../entities/Review.js";

import { Review_Report } from "../entities/Review_Report.js";
import { Review_Reaction } from "../entities/Review_Reaction.js";
import { FailureTag } from "../entities/FailureTag.js";
import { Photo } from "../entities/Photo.js";

export class ReviewService {
    constructor() {
        this.reviewRepository = AppDataSource.getRepository(Review);
        this.reportRepository = AppDataSource.getRepository(Review_Report);
        this.reactionRepository = AppDataSource.getRepository(Review_Reaction);
        this.tagRepository = AppDataSource.getRepository(FailureTag);
        this.photoRepository = AppDataSource.getRepository(Photo);
    }

    async create(reviewData, failureTagsIds = [], photoUrls = []) {
        // 1. Crear la review base
        const review = this.reviewRepository.create(reviewData);

        // 2. Asociar tags si existen
        if (failureTagsIds && failureTagsIds.length > 0) {
            const { In } = await import('typeorm');
            const tags = await this.tagRepository.findBy({
                id: In(failureTagsIds)
            });
            review.failureTags = tags;
        }

        // 3. Guardar review
        const savedReview = await this.reviewRepository.save(review);

        // 4. Guardar fotos si existen
        if (photoUrls.length > 0) {
            const photos = photoUrls.map(url => this.photoRepository.create({
                url,
                review: savedReview
            }));
            await this.photoRepository.save(photos);
        }

        return this.reviewRepository.findOne({
            where: { id: savedReview.id },
            relations: ["user", "failureTags", "photos"]
        });
    }

    async findByCarId(carId, userId = null) {
        const reviews = await this.reviewRepository.find({
            where: { car: { id: carId } },
            relations: ["user", "failureTags", "photos", "reactions"],
            order: { created_at: "DESC" }
        });

        // Procesar reacciones para el frontend
        return reviews.map(review => {
            const likes = review.reactions.filter(r => r.reactionType === 'LIKE').length;
            const dislikes = review.reactions.filter(r => r.reactionType === 'DISLIKE').length;

            let userReaction = null;
            if (userId) {
                const reaction = review.reactions.find(r => r.user_id === userId);
                if (reaction) userReaction = reaction.reactionType;
            }

            // Limpiamos el objeto para no enviar todas las reacciones crudas
            const { reactions, ...reviewData } = review;
            return {
                ...reviewData,
                likes,
                dislikes,
                userReaction
            };
        });
    }

    async getCommonFaults(carId) {
        try {
            const result = await this.tagRepository.createQueryBuilder("tag")
                .innerJoin("review_failure_tags", "rft", "rft.tag_id = tag.id")
                .innerJoin("reviews", "review", "review.id = rft.review_id")
                .where("review.car_id = :carId", { carId })
                .select("tag.name", "name")
                .addSelect("COUNT(tag.id)", "count")
                .groupBy("tag.id")
                .addGroupBy("tag.name")
                .orderBy("count", "DESC")
                .limit(5)
                .getRawMany();

            // Convert count to number (it comes as string from raw query)
            return result.map(item => ({
                name: item.name,
                count: parseInt(item.count, 10)
            }));
        } catch (error) {
            console.error("Error getting common faults:", error);
            return [];
        }
    }

    async toggleReaction(reviewId, userId, type) {
        const existingReaction = await this.reactionRepository.findOne({
            where: { review: { id: reviewId }, user: { id: userId } }
        });

        if (existingReaction) {
            if (existingReaction.reactionType === type) {
                // Si es el mismo tipo, quitamos la reacción (toggle off)
                await this.reactionRepository.remove(existingReaction);
                return { action: 'removed' };
            } else {
                // Si es diferente, actualizamos
                existingReaction.reactionType = type;
                await this.reactionRepository.save(existingReaction);
                return { action: 'updated', type };
            }
        } else {
            // Crear nueva reacción
            const newReaction = this.reactionRepository.create({
                review: { id: reviewId },
                user: { id: userId },
                reactionType: type
            });
            await this.reactionRepository.save(newReaction);
            return { action: 'created', type };
        }
    }

    async reportReview(reviewId, userId, reason, details) {
        const report = this.reportRepository.create({
            review: { id: reviewId },
            user: { id: userId },
            reason,
            details,
            status: 'PENDING'
        });
        return await this.reportRepository.save(report);
    }

    async findReported() {
        return await this.reportRepository.find({
            where: { status: "PENDING" },
            relations: ["review", "review.user", "review.car", "review.failureTags", "review.photos", "user"],
            order: { created_at: "DESC" }
        });
    }

    async dismissReport(reportId) {
        const report = await this.reportRepository.findOne({
            where: { id: reportId }
        });

        if (!report) {
            throw new Error("Reporte no encontrado");
        }

        report.status = "DISMISSED";
        await this.reportRepository.save(report);
        return { message: "Reporte descartado correctamente" };
    }

    async deleteReviewFromReport(reportId) {
        const report = await this.reportRepository.findOne({
            where: { id: reportId },
            relations: ["review"]
        });

        if (!report) {
            throw new Error("Reporte no encontrado");
        }

        if (!report.review) {
            throw new Error("Reseña no encontrada");
        }

        const reviewId = report.review.id;

        // Delete the review (this will cascade delete the report)
        await this.reviewRepository.delete(reviewId);

        return { message: "Reseña eliminada correctamente" };
    }

    async delete(reviewId, userId, isAdmin) {
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: ["user"]
        });

        if (!review) {
            throw new Error("Reseña no encontrada");
        }

        if (review.user.id !== userId && !isAdmin) {
            throw new Error("No tienes permiso para eliminar esta reseña");
        }

        await this.reviewRepository.remove(review);
        return { message: "Reseña eliminada correctamente" };
    }
}
