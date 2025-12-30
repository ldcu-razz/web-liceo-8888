import { API_TICKETS, API_TICKETS_ID } from "$lib/constants/routes.constants";
import type { Pagination } from "$lib/models/common/common.type";
import type { GetTicket, GetTicketsPaginated, PostTicket, PutTicket } from "$lib/models/tickets/tickets.type";
import { getRoute, getRouteWithParams } from "$lib/utils/routes.utils";

export const getTickets = async (pagination: Pagination, q?: string, departmentAssignedId?: string, userAssignedId?: string): Promise<GetTicketsPaginated> => {
  const url = new URL(getRoute(API_TICKETS, {}), window.location.origin);
  url.searchParams.set('page', pagination.page.toString());
  url.searchParams.set('size', pagination.size.toString());

  if (q) url.searchParams.set('q', q);
  if (departmentAssignedId) url.searchParams.set('departmentAssignedId', departmentAssignedId);
  if (userAssignedId) url.searchParams.set('userAssignedId', userAssignedId);

  const result = await fetch(url.toString());
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};

export const getTicket = async (id: string): Promise<GetTicket> => {
  const url = new URL(API_TICKETS_ID.replace('{id}', id), window.location.origin);
  const result = await fetch(url.toString());

  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};

export const createTicket = async (ticket: PostTicket): Promise<GetTicket> => {
  const url = new URL(getRoute(API_TICKETS, {}), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(ticket),
  });

  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};

export const updateTicket = async (id: string, ticket: PutTicket): Promise<GetTicket> => {
  const url = new URL(getRouteWithParams(API_TICKETS_ID, { id }), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(ticket),
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};