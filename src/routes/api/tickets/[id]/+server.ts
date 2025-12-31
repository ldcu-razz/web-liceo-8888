import { TABLES } from "$lib/constants/tables.constants";
import type { GetTicket, Ticket } from "$lib/models/tickets/tickets.type";
import { supabase } from "$lib/supabase/client";

export const GET = async ({ params }) => {
  const { id } = params;
  const { data, error } = await supabase.from('tickets').select(`
    *,
    category:${TABLES.TICKET_CATEGORIES}!category_id(*),
    current_department_assigned:${TABLES.DEPARTMENTS}!current_department_assigned(*),
    current_user_assigned:${TABLES.USERS}!current_user_assigned(*),
    reported_by:${TABLES.USERS}!reported_by(*),
    files(*)
  `).eq('id', id).single().overrideTypes<GetTicket>();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const PUT = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
  const { data, error } = await supabase.from(TABLES.TICKETS).update(body).eq('id', id).select(`
    *,
    category:${TABLES.TICKET_CATEGORIES}!category_id(id, name),  
    current_department_assigned:${TABLES.DEPARTMENTS}!current_department_assigned(id, name, abbv),
    current_user_assigned:${TABLES.USERS}!current_user_assigned(id, firstname, lastname, avatar),
    reported_by:${TABLES.USERS}!reported_by(id, firstname, lastname, avatar),
    files(*)
    `).single().overrideTypes<GetTicket>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export const DELETE = async ({ params }) => {
  const { id } = params;
  
  const { error } = await supabase.from(TABLES.TICKETS).delete().eq('id', id).select().overrideTypes<Ticket>();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(true), { status: 200 });
}