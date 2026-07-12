// src/pages/api/admin/jerseys/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Jersey ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: jersey, error } = await supabase
            .from('jerseys')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'Jersey not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: jersey }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get jersey error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { event_id, title, image, description } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Jersey ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if jersey exists
        const { data: existingJersey } = await supabase
            .from('jerseys')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingJersey) {
            return new Response(
                JSON.stringify({ error: 'Jersey not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If event_id is provided, check if event exists
        if (event_id) {
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
        }

        const { data: jersey, error } = await supabase
            .from('jerseys')
            .update({
                event_id: event_id !== undefined ? event_id : undefined,
                title: title || undefined,
                image: image || undefined,
                description: description !== undefined ? description : undefined
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
            JSON.stringify({ success: true, data: jersey }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update jersey error:', error);
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
                JSON.stringify({ error: 'Jersey ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if jersey exists
        const { data: existingJersey } = await supabase
            .from('jerseys')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingJersey) {
            return new Response(
                JSON.stringify({ error: 'Jersey not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('jerseys')
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
        console.error('Delete jersey error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};