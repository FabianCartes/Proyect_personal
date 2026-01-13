import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();
const userController = new UserController();

router.get("/profile", authMiddleware, userController.getProfile);
router.get("/profile/stats", authMiddleware, userController.getProfileStats);
router.get("/profile/reviews", authMiddleware, userController.getProfileReviews);
router.get("/:id/stats", userController.getPublicProfileStats); // Public stats
router.get("/:id", userController.getById); // Public or auth? Let's make it public for now or auth if needed. The prompt implies community interaction.
router.get("/", authMiddleware, isAdmin, userController.getAll);

export default router;
