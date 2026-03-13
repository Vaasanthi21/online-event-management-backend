import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../config/supabase';

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, is_public } = req.query;

    let query = supabase.from('events').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (is_public !== undefined) {
      query = query.eq('is_public', is_public === 'true');
    }

    const { data: events, error } = await query.order('start_date', { ascending: true });

    if (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
      return;
    }

    res.json({ events });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json({ event });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = (req as any).user;
    const {
      title,
      description,
      start_date,
      end_date,
      timezone,
      location_type,
      meeting_link,
      address,
      max_attendees,
      is_public,
      banner_image,
    } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description,
          start_date,
          end_date,
          timezone: timezone || 'UTC',
          location_type: location_type || 'virtual',
          meeting_link,
          address,
          max_attendees,
          is_public: is_public !== undefined ? is_public : true,
          banner_image,
          organizer_id: user.id,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: 'Error creating event', error: error.message });
      return;
    }

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = (req as any).user;
    const { id } = req.params;

    const { data: existingEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (existingEvent.organizer_id !== user.id && user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this event' });
      return;
    }

    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data: event, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ message: 'Error updating event', error: error.message });
      return;
    }

    res.json({ message: 'Event updated successfully', event });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const { data: existingEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (existingEvent.organizer_id !== user.id && user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this event' });
      return;
    }

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      res.status(500).json({ message: 'Error deleting event', error: error.message });
      return;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id)
      .order('start_date', { ascending: true });

    if (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
      return;
    }

    res.json({ events });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
