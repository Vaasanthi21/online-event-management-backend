import { Router } from 'express';
import { getEventAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', authenticate, getEventAnalytics);

export default router;
