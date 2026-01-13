import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { envs } from '../config/configEnv.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '.webp';
        const uploadDir = path.join(__dirname, '../../uploads');
        const filepath = path.join(uploadDir, filename);

        // Ensure directory exists (redundant if middleware check is kept, but safe)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Process image with Sharp
        await sharp(req.file.buffer)
            .resize({ width: 1024, withoutEnlargement: true }) // Resize to max width 1024px
            .toFormat('webp')
            .webp({ quality: 80 }) // Compress to 80% quality
            .toFile(filepath);

        // Construct URL
        const imageUrl = `http://${envs.appHost}:${envs.appPort}/uploads/${filename}`;

        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
