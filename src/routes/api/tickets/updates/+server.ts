import { TABLES } from "$lib/constants/tables.constants";
import { supabase } from "$lib/supabase/client";
import type { GetTicketsUpdates, GetTicketsUpdatesPaginated } from "$lib/models/tickets/tickets-updates.type";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 20;
  const ticketId = url.searchParams.get('ticketId');

  let queryBuilder = supabase.from(TABLES.TICKETS_UPDATES).select('*');
  let countQueryBuilder = supabase.from(TABLES.TICKETS_UPDATES).select('*', { count: 'exact', head: true });

  if (ticketId) {
    queryBuilder = queryBuilder.eq('ticket_id', ticketId).order('updated_at', { ascending: false });
    countQueryBuilder = countQueryBuilder.eq('ticket_id', ticketId);
  }

  if (size && page) {
    queryBuilder = queryBuilder.range((page - 1) * size, page * size - 1);
  }

  const { data, error } = await queryBuilder.overrideTypes<GetTicketsUpdatesPaginated>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { count, error: countError } = await countQueryBuilder;
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ data, count, page, size }), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const { data, error } = await supabase.from(TABLES.TICKETS_UPDATES).insert(body).select('*').single().overrideTypes<GetTicketsUpdates>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}