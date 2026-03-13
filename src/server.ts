import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import sessionRoutes from './routes/sessionRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/events/:eventId/sessions', sessionRoutes);
app.use('/api/events/:eventId/feedback', feedbackRoutes);
app.use('/api/events/:eventId/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Convene server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
