import { Router } from "express";
import { CarController } from "../controllers/carController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();
const carController = new CarController();

// Public routes
router.get("/", carController.getAll);
router.get("/popular", carController.getPopular);
router.get("/related", carController.getRelated);
router.get("/:id", carController.getOne);

// Admin-only routes
router.post("/", authMiddleware, isAdmin, carController.create);
router.put("/:id", authMiddleware, isAdmin, carController.update);
router.delete("/:id", authMiddleware, isAdmin, carController.delete);

export default router;
