import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getEventFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const { data: feedback, error } = await supabase
      .from('feedback')
      .select(`
        *,
        user:users(id, full_name)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
      return;
    }

    res.json({ feedback });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { session_id, overall_rating, content_rating, speaker_rating, organization_rating, comments, would_recommend } = req.body;
    
    const user = (req as any).user;

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert([{
        event_id: eventId,
        session_id,
        user_id: user.id,
        overall_rating,
        content_rating,
        speaker_rating,
        organization_rating,
        comments,
        would_recommend,
      }])
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: 'Error submitting feedback', error: error.message });
      return;
    }

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
