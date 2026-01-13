import { AdminService } from "../services/adminService.js";

const adminService = new AdminService();

export class AdminController {
    async getStats(req, res) {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            console.error("Error getting admin stats:", error);
            res.status(500).json({ message: "Error al obtener estadísticas del dashboard" });
        }
    }
}
