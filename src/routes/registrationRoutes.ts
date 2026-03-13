import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMyRegistrations,
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
} from '../controllers/registrationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my-registrations', authenticate, getMyRegistrations);
router.get('/event/:eventId', authenticate, getEventRegistrations);

router.post(
  '/',
  authenticate,
  [
    body('event_id').isUUID(),
    body('ticket_type_id').optional().isUUID(),
  ],
  registerForEvent
);

router.delete('/:id', authenticate, cancelRegistration);

export default router;
