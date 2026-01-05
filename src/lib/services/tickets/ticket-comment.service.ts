import { API_TICKETS_ID_COMMENT } from "$lib/constants";
import type { Pagination } from "$lib/models/common/common.type";
import type { DeleteTicketComment, GetTicketComment, GetTicketCommentsPaginated, PostTicketComment, PutTicketComment } from "$lib/models/tickets/ticket-comments.type";
import { getRouteWithParams } from "$lib/utils/routes.utils";

export const getTicketComments = async (ticket_id : string, pagination?: Pagination): Promise<GetTicketCommentsPaginated> => {
  const url = new URL(getRouteWithParams(API_TICKETS_ID_COMMENT, { id: ticket_id }), window.location.origin);
  if (pagination) {
    url.searchParams.set('page', pagination.page.toString());
    url.searchParams.set('size', pagination.size.toString());
  }
  try {
    const result = await fetch(url.toString());
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
};

export const postTicketComment = async (ticket_id : string, body: PostTicketComment): Promise<GetTicketComment> => {
  const url = new URL(getRouteWithParams(API_TICKETS_ID_COMMENT, { id: ticket_id }), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};

export const putTicketComment = async (ticket_id : string, body: PutTicketComment): Promise<GetTicketComment> => {
  const url = new URL(getRouteWithParams(API_TICKETS_ID_COMMENT, { id: ticket_id }), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};

export const deleteTicketComment = async (ticket_id : string, body: DeleteTicketComment): Promise<boolean> => {
  const url = new URL(getRouteWithParams(API_TICKETS_ID_COMMENT, { id: ticket_id }), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'DELETE',
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
};