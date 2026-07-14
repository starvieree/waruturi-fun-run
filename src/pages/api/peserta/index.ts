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
        event_categories (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET error:', error);
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
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['event_id', 'fullname', 'email', 'phone', 'gender', 'birth_date', 'jersey_size', 'emergency_contact'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Field '${field}' is required` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

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
        payment_proof: body.payment_proof || null,
        payment_status: body.payment_status || 'pending',
        notes: body.notes || null
      })
      .select(`
        *,
        events (
          id,
          title,
          event_categories (
            id,
            name
          )
        )
      `)
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};