// src/pages/api/admin/events/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const {
            category_id, title, slug, description, date_event,
            start_time, location, maps, quota, price, banner,
            registration_open
        } = body;

        if (!title) {
            return new Response(
                JSON.stringify({ error: 'Title is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if not provided
        const eventSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { data: event, error } = await supabase
            .from('events')
            .insert({
                category_id: category_id || null,
                title,
                slug: eventSlug,
                description: description || null,
                date_event: date_event || null,
                start_time: start_time || null,
                location: location || null,
                maps: maps || null,
                quota: quota || null,
                price: price || null,
                banner: banner || null,
                registration_open: registration_open !== undefined ? registration_open : true
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
            JSON.stringify({ success: true, data: event }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create event error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};