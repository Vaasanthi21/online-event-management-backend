import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getEventAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    // Get registration stats
    const { data: registrations } = await supabase
      .from('registrations')
      .select('status')
      .eq('event_id', eventId);

    const confirmedCount = registrations?.filter(r => r.status === 'confirmed').length || 0;
    const pendingCount = registrations?.filter(r => r.status === 'pending').length || 0;
    const cancelledCount = registrations?.filter(r => r.status === 'cancelled').length || 0;

    // Get feedback stats
    const { data: feedback } = await supabase
      .from('feedback')
      .select('overall_rating')
      .eq('event_id', eventId);

    const avgRating = feedback?.length
      ? feedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / feedback.length
      : 0;

    res.json({
      event: {
        id: event.id,
        title: event.title,
        status: event.status,
      },
      registrations: {
        total: registrations?.length || 0,
        confirmed: confirmedCount,
        pending: pendingCount,
        cancelled: cancelledCount,
        max_capacity: event.max_attendees,
      },
      feedback: {
        count: feedback?.length || 0,
        average_rating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
