/**
 * Generation Routes
 * Owned by Developer 4
 * Conforms to Problem Statement 06 (Page 8-9)
 */

import { Router } from 'express';
import * as generationController from '../controllers/generationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// /api/v1/generate and /api/v1/download/:token
router.post('/generate', protect, generationController.generate);
router.get('/download/:token', protect, generationController.download);

// /api/v1/generation/:buildId
router.post('/:buildId/trigger', protect, generationController.triggerGeneration);
router.get('/:buildId/logs', protect, generationController.getGenerationLogs);

export default router;
