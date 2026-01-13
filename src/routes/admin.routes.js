import { Router } from "express";
import { AdminController } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();
const adminController = new AdminController();

// All routes require auth and admin role
router.use(authMiddleware, isAdmin);

router.get("/stats", adminController.getStats);

export default router;
