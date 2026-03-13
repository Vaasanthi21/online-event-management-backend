import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getMyRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        event:events(*),
        ticket_type:ticket_types(*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ message: 'Error fetching registrations', error: error.message });
      return;
    }

    res.json({ registrations });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { event_id, ticket_type_id } = req.body;
    const eventId = event_id;
    const ticketTypeId = ticket_type_id;

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', req.user.id)
      .single();

    if (existingRegistration) {
      res.status(400).json({ message: 'Already registered for this event' });
      return;
    }

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

    // Check if event is full
    if (event.max_attendees) {
      const { count: registrationCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (registrationCount && registrationCount >= event.max_attendees) {
        res.status(400).json({ message: 'Event is full' });
        return;
      }
    }

    let registrationData: any = {
      event_id: eventId,
      user_id: req.user.id,
      status: 'confirmed',
      payment_status: 'completed',
      payment_amount: 0,
      payment_currency: 'USD',
    };

    // If ticket type is provided, use it
    if (ticketTypeId) {
      const { data: ticketType } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('id', ticketTypeId)
        .single();

      if (!ticketType) {
        res.status(404).json({ message: 'Ticket type not found' });
        return;
      }

      if (ticketType.quantity_sold >= ticketType.quantity_available) {
        res.status(400).json({ message: 'Tickets sold out' });
        return;
      }

      registrationData.ticket_type_id = ticketTypeId;
      registrationData.payment_amount = ticketType.price;
      registrationData.payment_currency = ticketType.currency;
      registrationData.status = ticketType.price > 0 ? 'pending' : 'confirmed';
      registrationData.payment_status = ticketType.price > 0 ? 'pending' : 'completed';

      // Update ticket count
      await supabase
        .from('ticket_types')
        .update({ quantity_sold: ticketType.quantity_sold + 1 })
        .eq('id', ticketTypeId);
    }

    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([registrationData])
      .select(`
        *,
        event:events(*)
      `)
      .single();

    if (error) {
      res.status(500).json({ message: 'Error creating registration', error: error.message });
      return;
    }

    // Create notification for the user
    await supabase
      .from('notifications')
      .insert([{
        user_id: req.user.id,
        type: 'registration_confirmed',
        title: 'Registration Confirmed',
        message: `You have successfully registered for "${event.title}"`,
        data: { event_id: eventId, registration_id: registration.id },
      }]);

    res.status(201).json({ 
      message: 'Registration successful', 
      registration,
      notification: {
        title: 'Registration Confirmed',
        message: `You have successfully registered for "${event.title}"`
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: registration } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    const { error } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      res.status(500).json({ message: 'Error cancelling registration', error: error.message });
      return;
    }

    const { data: ticketType } = await supabase
      .from('ticket_types')
      .select('*')
      .eq('id', registration.ticket_type_id)
      .single();

    if (ticketType) {
      await supabase
        .from('ticket_types')
        .update({ quantity_sold: Math.max(0, ticketType.quantity_sold - 1) })
        .eq('id', registration.ticket_type_id);
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEventRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

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

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        user:users(id, full_name, email),
        ticket_type:ticket_types(*)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ message: 'Error fetching registrations', error: error.message });
      return;
    }

    res.json({ registrations });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
