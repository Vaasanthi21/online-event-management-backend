import { Router } from 'express';
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', getSessions);
router.post('/', authenticate, createSession);
router.put('/:id', authenticate, updateSession);
router.delete('/:id', authenticate, deleteSession);

export default router;
