import type { TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ params }) => {
  const { id } = params;
  const { data, error } = await supabase.from('ticket_categories').select('*').eq('id', id).single().overrideTypes<TicketCategories>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};

export const PUT = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
  const { data, error } = await supabase.from('ticket_categories').update(body).eq('id', id).select().single().overrideTypes<TicketCategories>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};