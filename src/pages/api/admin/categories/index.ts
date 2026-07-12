// src/pages/api/admin/categories/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, slug } = body;

        if (!name) {
            return new Response(
                JSON.stringify({ error: 'Category name is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if not provided
        const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check if slug already exists
        const { data: existingSlug } = await supabase
            .from('event_categories')
            .select('slug')
            .eq('slug', categorySlug)
            .single();

        if (existingSlug) {
            return new Response(
                JSON.stringify({ error: 'Slug already exists. Please use a different name.' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: category, error } = await supabase
            .from('event_categories')
            .insert({
                name,
                slug: categorySlug
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
            JSON.stringify({ success: true, data: category }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create category error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};