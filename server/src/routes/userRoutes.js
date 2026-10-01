/**
 * User Routes
 * Owned by Developer 4
 */

import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id', protect, userController.getProfile);
router.put('/:id', protect, userController.updateProfile);

export default router;
