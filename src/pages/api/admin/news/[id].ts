// src/pages/api/admin/news/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'News ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: news, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'News not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: news }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get news error:', error);
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
        const { title, slug, image, content, published } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'News ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if news exists
        const { data: existingNews } = await supabase
            .from('news')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingNews) {
            return new Response(
                JSON.stringify({ error: 'News not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if provided and not empty
        let newsSlug = slug;
        if (title && !slug) {
            newsSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        const { data: news, error } = await supabase
            .from('news')
            .update({
                title: title || undefined,
                slug: newsSlug || undefined,
                image: image !== undefined ? image : undefined,
                content: content || undefined,
                published: published !== undefined ? published : undefined
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
            JSON.stringify({ success: true, data: news }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update news error:', error);
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
                JSON.stringify({ error: 'News ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if news exists
        const { data: existingNews } = await supabase
            .from('news')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingNews) {
            return new Response(
                JSON.stringify({ error: 'News not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('news')
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
        console.error('Delete news error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};