// src/pages/api/admin/categories/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Category ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: category, error } = await supabase
            .from('event_categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'Category not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: category }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get category error:', error);
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
        const { name, slug } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Category ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if category exists
        const { data: existingCategory } = await supabase
            .from('event_categories')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingCategory) {
            return new Response(
                JSON.stringify({ error: 'Category not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if name is provided and slug is not
        let categorySlug = slug;
        if (name && !slug) {
            categorySlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        // If slug is provided or generated, check if it exists (except for this category)
        if (categorySlug) {
            const { data: existingSlug } = await supabase
                .from('event_categories')
                .select('slug')
                .eq('slug', categorySlug)
                .neq('id', id)
                .single();

            if (existingSlug) {
                return new Response(
                    JSON.stringify({ error: 'Slug already exists. Please use a different name.' }),
                    { status: 409, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const { data: category, error } = await supabase
            .from('event_categories')
            .update({
                name: name || undefined,
                slug: categorySlug || undefined
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
            JSON.stringify({ success: true, data: category }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update category error:', error);
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
                JSON.stringify({ error: 'Category ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if category exists
        const { data: existingCategory } = await supabase
            .from('event_categories')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingCategory) {
            return new Response(
                JSON.stringify({ error: 'Category not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if category is used in events
        const { data: events, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('category_id', id)
            .limit(1);

        if (eventError) {
            return new Response(
                JSON.stringify({ error: eventError.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (events && events.length > 0) {
            return new Response(
                JSON.stringify({ 
                    error: 'Cannot delete category because it is used in events. Please reassign or delete the events first.' 
                }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('event_categories')
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
        console.error('Delete category error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};