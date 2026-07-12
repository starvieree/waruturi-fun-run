// src/pages/api/admin/galleries/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { event_id, title, image } = body;

        if (!event_id) {
            return new Response(
                JSON.stringify({ error: 'Event ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!title) {
            return new Response(
                JSON.stringify({ error: 'Title is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!image) {
            return new Response(
                JSON.stringify({ error: 'Image URL is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if event exists
        const { data: event } = await supabase
            .from('events')
            .select('id')
            .eq('id', event_id)
            .single();

        if (!event) {
            return new Response(
                JSON.stringify({ error: 'Event not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: gallery, error } = await supabase
            .from('galleries')
            .insert({
                event_id,
                title,
                image
            })
            .select()
            .single();

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: gallery }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create gallery error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};