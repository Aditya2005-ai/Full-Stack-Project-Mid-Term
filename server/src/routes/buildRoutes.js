/**
 * Build Routes
 * Owned by Developer 4
 * Conforms to Problem Statement 06 & Phase 18
 */

import { Router } from 'express';
import * as buildController from '../controllers/buildController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// /api/v1/builds
router.post('/', protect, buildController.createBuild);
router.get('/', protect, buildController.getUserBuilds);
router.get('/mine', protect, buildController.getUserBuilds);
router.post('/resolve', protect, buildController.resolveBuild);

router.get('/:id', protect, buildController.getBuildById);
router.post('/:id/generate', protect, buildController.triggerBuildGeneration);
router.get('/:id/status', protect, buildController.getBuildStatus);
router.get('/:id/download', protect, buildController.downloadBuildZip);
router.patch('/:id', protect, buildController.updateBuild);
router.put('/:id', protect, buildController.updateBuild);
router.delete('/:id', protect, buildController.deleteBuild);
router.post('/:id/duplicate', protect, buildController.duplicateBuild);
router.post('/:id/resolve', protect, buildController.resolveBuild);

export default router;
