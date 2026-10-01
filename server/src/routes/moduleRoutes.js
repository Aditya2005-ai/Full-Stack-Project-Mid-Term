/**
 * Module Catalogue Routes
 * Owned by Developer 4
 */

import { Router } from 'express';
import * as moduleController from '../controllers/moduleController.js';

const router = Router();

router.get('/', moduleController.getModules);
router.get('/:id', moduleController.getModuleById);

export default router;
