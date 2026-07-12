// src/pages/api/admin/faqs/[id].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'FAQ ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: faq, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return new Response(
                    JSON.stringify({ error: 'FAQ not found' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data: faq }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Get FAQ error:', error);
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
        const { question, answer, ordering } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'FAQ ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if FAQ exists
        const { data: existingFaq } = await supabase
            .from('faqs')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingFaq) {
            return new Response(
                JSON.stringify({ error: 'FAQ not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: faq, error } = await supabase
            .from('faqs')
            .update({
                question: question || undefined,
                answer: answer || undefined,
                ordering: ordering !== undefined ? ordering : undefined
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
            JSON.stringify({ success: true, data: faq }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Update FAQ error:', error);
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
                JSON.stringify({ error: 'FAQ ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if FAQ exists
        const { data: existingFaq } = await supabase
            .from('faqs')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingFaq) {
            return new Response(
                JSON.stringify({ error: 'FAQ not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { error } = await supabase
            .from('faqs')
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
        console.error('Delete FAQ error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};