import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        *,
        speakers:speakers(*)
      `)
      .eq('event_id', eventId)
      .order('start_time', { ascending: true });

    if (error) {
      res.status(500).json({ message: 'Error fetching sessions', error: error.message });
      return;
    }

    res.json({ sessions });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { title, description, start_time, end_time, session_type, speaker_ids, max_attendees, meeting_link } = req.body;

    const { data: session, error } = await supabase
      .from('sessions')
      .insert([{
        event_id: eventId,
        title,
        description,
        start_time,
        end_time,
        session_type: session_type || 'keynote',
        speaker_ids: speaker_ids || [],
        max_attendees,
        meeting_link,
      }])
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: 'Error creating session', error: error.message });
      return;
    }

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, id } = req.params;

    const { data: session, error } = await supabase
      .from('sessions')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('event_id', eventId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: 'Error updating session', error: error.message });
      return;
    }

    res.json({ message: 'Session updated successfully', session });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(500).json({ message: 'Error deleting session', error: error.message });
      return;
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
