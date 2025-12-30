import { TABLES } from "$lib/constants/tables.constants";
import { TICKET_CODE_PREFIX } from "$lib/constants/ticket.constants.js";
import type { GetTicket, GetTicketsPaginated } from "$lib/models/tickets/tickets.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 20;
  const departmentAssignedId = url.searchParams.get('departmentAssignedId') || '';
  const userAssignedId = url.searchParams.get('userAssignedId') || '';
  const q = url.searchParams.get('q') || '';

  let query = supabase.from(TABLES.TICKETS)
    .select(`
      *,
      category:${TABLES.TICKET_CATEGORIES}!category_id(id, name),
      current_department_assigned:${TABLES.DEPARTMENTS}!current_department_assigned(id, name, abbv),
      current_user_assigned:${TABLES.USERS}!current_user_assigned(id, firstname, lastname, avatar),
      reported_by:${TABLES.USERS}!reported_by(id, firstname, lastname, avatar),
      files(*)
    `)
    .order('createdAt', { ascending: false })
    .range((page - 1) * size, page * size - 1);

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  if (departmentAssignedId) {
    query = query.eq('current_department_assigned', departmentAssignedId);
  }

  if (userAssignedId) {
    query = query.eq('current_user_assigned', userAssignedId);
  }

  const { data, error } = await query.overrideTypes<GetTicketsPaginated>();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const { count, error: countError } = await supabase.from(TABLES.TICKETS).select('*', { count: 'exact', head: true });
  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ data, count, page, size }), { status: 200 });
}

export const POST = async ({ request }) => {
  const body = await request.json();
  const { count: countTickets, error: countTicketsError } = await supabase.from(TABLES.TICKETS).select('*', { count: 'exact', head: true });
  if (countTicketsError) {
    return new Response(JSON.stringify({ error: countTicketsError.message }), { status: 500 });
  }

  const code = `${TICKET_CODE_PREFIX}-${(countTickets ?? 0) + 1}`;

  const payload = {
    ...body,
    code,
  };
  
  const { data, error } = await supabase.from(TABLES.TICKETS).insert(payload).select(
    `*,
    category:${TABLES.TICKET_CATEGORIES}!category_id(id, name),
    current_department_assigned:${TABLES.DEPARTMENTS}!current_department_assigned(id, name, abbv),
    current_user_assigned:${TABLES.USERS}!current_user_assigned(id, firstname, lastname, avatar),
    reported_by:${TABLES.USERS}!reported_by(id, firstname, lastname, avatar),
    files(*)
    `
  ).single().overrideTypes<GetTicket>();
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}