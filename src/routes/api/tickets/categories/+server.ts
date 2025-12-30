import { TABLES } from "$lib/constants/tables.constants";
import type { TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";
import { supabase } from "$lib/supabase/client.js";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 15;
  const q = url.searchParams.get('q') || '';

  const response = await supabase.from(TABLES.TICKET_CATEGORIES)
    .select('*')
    .order('createdAt', { ascending: false })
    .range((page - 1) * size, page * size - 1)
    .or(`name.ilike.%${q}%`)
    .overrideTypes<TicketCategories>();

  if (response.error) {
    return new Response(JSON.stringify({ error: response.error.message }), { status: 500 });
  }

  const { count, error: countError } = await supabase.from(TABLES.TICKET_CATEGORIES).select('*', { count: 'exact', head: true });
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ data: response.data, count, page, size }), { status: 200 });
};

export const POST = async ({ request }) => {
  const body = await request.json();
  const { data, error } = await supabase.from(TABLES.TICKET_CATEGORIES).insert(body).select().single().overrideTypes<TicketCategories>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};