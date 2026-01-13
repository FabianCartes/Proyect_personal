import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { envs } from '../config/configEnv.js';

const router = Router();

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        // Construct URL
        // Assuming server serves 'uploads' folder at /uploads
        const imageUrl = `http://${envs.appHost}:${envs.appPort}/uploads/${req.file.filename}`;

        res.json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
