// src/pages/api/admin/news/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { title, slug, image, content, published } = body;

        if (!title) {
            return new Response(
                JSON.stringify({ error: 'Title is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!content) {
            return new Response(
                JSON.stringify({ error: 'Content is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate slug if not provided
        const newsSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { data: news, error } = await supabase
            .from('news')
            .insert({
                title,
                slug: newsSlug,
                image: image || null,
                content,
                published: published !== undefined ? published : false
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
            JSON.stringify({ success: true, data: news }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create news error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};