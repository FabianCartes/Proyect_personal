import { Router } from "express";
import { FeedbackController } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();
const feedbackController = new FeedbackController();

// Public routes (anyone can see suggestions and submit them)
// Note: We might want to make submission auth-only later, but for now it's open or optional auth handled in controller
router.get("/", feedbackController.getAll);
router.post("/", authMiddleware, feedbackController.create); // Optional auth middleware usage needs check

// Admin routes
router.delete("/:id", authMiddleware, isAdmin, feedbackController.delete);

export default router;
