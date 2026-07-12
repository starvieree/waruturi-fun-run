// src/pages/api/admin/sponsors/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Sponsor ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: sponsor, error } = await supabase
            .from('sponsors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'Sponsor not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: sponsor }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get sponsor error:', error);
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
        const { name, logo, website } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Sponsor ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if sponsor exists
        const { data: existingSponsor } = await supabase
            .from('sponsors')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingSponsor) {
            return new Response(
                JSON.stringify({ error: 'Sponsor not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: sponsor, error } = await supabase
            .from('sponsors')
            .update({
                name: name || undefined,
                logo: logo !== undefined ? logo : undefined,
                website: website !== undefined ? website : undefined
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
            JSON.stringify({ success: true, data: sponsor }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update sponsor error:', error);
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
                JSON.stringify({ error: 'Sponsor ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if sponsor exists
        const { data: existingSponsor } = await supabase
            .from('sponsors')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingSponsor) {
            return new Response(
                JSON.stringify({ error: 'Sponsor not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('sponsors')
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
        console.error('Delete sponsor error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};