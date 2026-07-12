// src/pages/api/peserta/index.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch all registrations with event data
export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      events (
        id,
        title,
        slug,
        category,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// POST - Create new registration
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: body.event_id,
      fullname: body.fullname,
      email: body.email,
      phone: body.phone,
      gender: body.gender,
      birth_date: body.birth_date,
      jersey_size: body.jersey_size,
      emergency_contact: body.emergency_contact,
      payment_status: 'pending'
    })
    .select(`
      *,
      events (
        id,
        name,
        category
      )
    `)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};