import { TABLES } from "$lib/constants/tables.constants";
import { TICKET_CODE_PREFIX } from "$lib/constants/ticket.constants.js";
import type { GetTicket, GetTicketsPaginated } from "$lib/models/tickets/tickets.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 20;
  const departmentsAssignedIds = url.searchParams.get('departmentsAssignedIds')?.split(',') || [];
  const usersAssignedIds = url.searchParams.get('usersAssignedIds')?.split(',') || [];
  const status = url.searchParams.get('status') || '';
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

  let countQuery = supabase.from(TABLES.TICKETS).select('*', { count: 'exact', head: true });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  if (departmentsAssignedIds.length > 0) {
    query = query.in('current_department_assigned', departmentsAssignedIds);
    countQuery = countQuery.in('current_department_assigned', departmentsAssignedIds);
  }

  if (usersAssignedIds.length > 0) {
    query = query.in('current_user_assigned', usersAssignedIds);
    countQuery = countQuery.in('current_user_assigned', usersAssignedIds);
  }

  if (status) {
    query = query.eq('status', status);
    countQuery = countQuery.eq('status', status);
  }

  const { data, error } = await query.overrideTypes<GetTicketsPaginated>();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const { count, error: countError } = await countQuery;
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