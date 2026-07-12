// src/pages/api/admin/galleries/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Gallery ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: gallery, error } = await supabase
            .from('galleries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'Gallery not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: gallery }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get gallery error:', error);
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
        const { event_id, title, image } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Gallery ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if gallery exists
        const { data: existingGallery } = await supabase
            .from('galleries')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingGallery) {
            return new Response(
                JSON.stringify({ error: 'Gallery not found' }),
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

        const { data: gallery, error } = await supabase
            .from('galleries')
            .update({
                event_id: event_id !== undefined ? event_id : undefined,
                title: title || undefined,
                image: image || undefined
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
            JSON.stringify({ success: true, data: gallery }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update gallery error:', error);
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
                JSON.stringify({ error: 'Gallery ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if gallery exists
        const { data: existingGallery } = await supabase
            .from('galleries')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingGallery) {
            return new Response(
                JSON.stringify({ error: 'Gallery not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('galleries')
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
        console.error('Delete gallery error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};