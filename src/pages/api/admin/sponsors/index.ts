// src/pages/api/admin/sponsors/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, logo, website } = body;

        if (!name) {
            return new Response(
                JSON.stringify({ error: 'Sponsor name is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: sponsor, error } = await supabase
            .from('sponsors')
            .insert({
                name,
                logo: logo || null,
                website: website || null
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
            JSON.stringify({ success: true, data: sponsor }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create sponsor error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};