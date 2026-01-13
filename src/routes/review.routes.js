import { Router } from "express";
import { ReviewController } from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

import { optionalAuthMiddleware } from "../middlewares/optionalAuthMiddleware.js";

const router = Router();
const reviewController = new ReviewController();

router.get("/reports", authMiddleware, isAdmin, reviewController.getReported);
router.get("/car/:carId", optionalAuthMiddleware, reviewController.getByCar);
router.get("/car/:carId/faults", reviewController.getCommonFaults);
router.post("/", authMiddleware, reviewController.create);
router.post("/:reviewId/reaction", authMiddleware, reviewController.toggleReaction);
router.post("/:reviewId/report", authMiddleware, reviewController.report);
router.delete("/:id", authMiddleware, reviewController.delete);
router.patch("/reports/:reportId/dismiss", authMiddleware, isAdmin, reviewController.dismissReport);
router.delete("/reports/:reportId/review", authMiddleware, isAdmin, reviewController.deleteReviewFromReport);

export default router;
