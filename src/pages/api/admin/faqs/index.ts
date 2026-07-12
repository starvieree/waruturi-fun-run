// src/pages/api/admin/faqs/index.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { question, answer, ordering } = body;

        if (!question) {
            return new Response(
                JSON.stringify({ error: 'Question is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!answer) {
            return new Response(
                JSON.stringify({ error: 'Answer is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If ordering is not provided, get the max ordering and add 1
        let finalOrdering = ordering;
        if (!finalOrdering) {
            const { data: maxOrder } = await supabase
                .from('faqs')
                .select('ordering')
                .order('ordering', { ascending: false })
                .limit(1);

            finalOrdering = maxOrder && maxOrder.length > 0 ? maxOrder[0].ordering + 1 : 1;
        }

        const { data: faq, error } = await supabase
            .from('faqs')
            .insert({
                question,
                answer,
                ordering: finalOrdering
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
            JSON.stringify({ success: true, data: faq }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Create FAQ error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};