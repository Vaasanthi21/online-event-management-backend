import { Router } from 'express';
import { getEventFeedback, submitFeedback } from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', authenticate, getEventFeedback);
router.post('/', authenticate, submitFeedback);

export default router;
