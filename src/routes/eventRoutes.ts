import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllEvents);
router.get('/my-events', authenticate, getMyEvents);
router.get('/:id', getEventById);

router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('start_date').isISO8601(),
    body('end_date').isISO8601(),
  ],
  createEvent
);

router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
