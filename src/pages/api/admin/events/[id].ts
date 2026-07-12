// src/pages/api/admin/events/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const {
            category_id, title, slug, description, date_event,
            start_time, location, maps, quota, price, banner,
            registration_open
        } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Event ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if event exists
        const { data: existingEvent } = await supabase
            .from('events')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingEvent) {
            return new Response(
                JSON.stringify({ error: 'Event not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if provided
        const eventSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

        const { data: event, error } = await supabase
            .from('events')
            .update({
                category_id: category_id !== undefined ? category_id : undefined,
                title: title || undefined,
                slug: eventSlug,
                description: description !== undefined ? description : undefined,
                date_event: date_event !== undefined ? date_event : undefined,
                start_time: start_time !== undefined ? start_time : undefined,
                location: location !== undefined ? location : undefined,
                maps: maps !== undefined ? maps : undefined,
                quota: quota !== undefined ? quota : undefined,
                price: price !== undefined ? price : undefined,
                banner: banner !== undefined ? banner : undefined,
                registration_open: registration_open !== undefined ? registration_open : undefined
            })
            .eq('id', id)
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
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update event error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const DELETE: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Event ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // First, check if event has related timelines
        const { data: timelines, error: timelineError } = await supabase
            .from('timelines')
            .select('id')
            .eq('event_id', id);

        if (timelineError) {
            return new Response(
                JSON.stringify({ error: timelineError.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If there are related timelines, delete them first
        if (timelines && timelines.length > 0) {
            const timelineIds = timelines.map(t => t.id);
            const { error: deleteTimelineError } = await supabase
                .from('timelines')
                .delete()
                .in('id', timelineIds);

            if (deleteTimelineError) {
                return new Response(
                    JSON.stringify({ 
                        error: 'Failed to delete related timelines: ' + deleteTimelineError.message 
                    }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Now delete the event
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Delete event error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// Add GET method for fetching single event
export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Event ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: event, error } = await supabase
            .from('events')
            .select('*, event_categories(name)')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'Event not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: event }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get event error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};