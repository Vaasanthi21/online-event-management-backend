export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'attendee' | 'organizer' | 'speaker' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  timezone: string;
  banner_image?: string;
  organizer_id: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  is_public: boolean;
  max_attendees?: number;
  location_type: 'virtual' | 'hybrid' | 'in_person';
  meeting_link?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  payment_currency: string;
  registration_date: string;
  checked_in: boolean;
  checked_in_at?: string;
  qr_code?: string;
  created_at: string;
}
