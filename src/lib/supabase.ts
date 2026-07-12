// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Type definitions
export type Profile = {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin' | 'super_admin' | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Event = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string | null;
  description: string | null;
  date_event: string | null;
  start_time: string | null;
  location: string | null;
  maps: string | null;
  quota: number | null;
  price: number | null;
  banner: string | null;
  registration_open: boolean | null;
  created_at: string | null;
};

export type EventCategory = {
  id: number;
  name: string;
  slug: string | null;
  created_at: string | null;
};

export type Jersey = {
  id: number;
  event_id: number | null;
  title: string | null;
  image: string | null;
  description: string | null;
};

export type Medal = {
  id: number;
  event_id: number | null;
  title: string | null;
  image: string | null;
  description: string | null;
};

export type Gallery = {
  id: number;
  event_id: number | null;
  title: string | null;
  image: string | null;
  created_at: string | null;
};

export type FAQ = {
  id: number;
  question: string | null;
  answer: string | null;
  ordering: number | null;
};

export type Sponsor = {
  id: number;
  name: string | null;
  logo: string | null;
  website: string | null;
};

export type Timeline = {
  id: number;
  event_id: number | null;
  title: string | null;
  event_date: string | null;
  description: string | null;
};

export type News = {
  id: number;
  title: string | null;
  slug: string | null;
  image: string | null;
  content: string | null;
  published: boolean | null;
  created_at: string | null;
};

export type Registration = {
  id: number;
  event_id: number | null;
  fullname: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  jersey_size: string | null;
  emergency_contact: string | null;
  payment_status: string | null;
  created_at: string | null;
};