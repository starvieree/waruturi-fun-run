// src/pages/api/about/index.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch about content
export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .limit(1)
    .single();

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

// PUT - Update about content
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('about_content')
    .update({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      vision: body.vision,
      mission: body.mission,
      highlights: body.highlights,
      organizer_profile: body.organizer_profile
    })
    .eq('id', body.id)
    .select()
    .single();

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