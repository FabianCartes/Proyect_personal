import { CarService } from "../services/carService.js";

const carService = new CarService();

export class CarController {
    async create(req, res) {
        try {
            const carData = { ...req.body };
            if (req.user) {
                carData.createdBy = req.user.id;
            }
            const car = await carService.create(carData);
            res.status(201).json(car);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const cars = await carService.findAll();
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const car = await carService.findById(req.params.id);
            if (!car) {
                return res.status(404).json({ message: "Auto no encontrado" });
            }
            res.json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const car = await carService.update(req.params.id, req.body);
            if (!car) {
                return res.status(404).json({ message: "Auto no encontrado" });
            }
            res.json(car);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await carService.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Auto no encontrado" });
            }
            res.json({ message: "Auto eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPopular(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 3;
            const cars = await carService.getPopularCars(limit);
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getRelated(req, res) {
        try {
            const { make, model, currentId } = req.query;
            if (!make || !model) {
                return res.status(400).json({ message: "Make and Model are required" });
            }
            const cars = await carService.findByMakeAndModel(make, model, currentId);
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

