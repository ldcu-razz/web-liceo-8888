import { API_TICKET_CATEGORIES } from "$lib/constants";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
import type { Pagination } from "$lib/models/common/common.type";
import type { PaginatedTicketCategories, PostTicketCategories, PutTicketCategories, TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";

export const getTicketCategories = async (pagination?: Pagination, q?: string): Promise<PaginatedTicketCategories> => {
  const url = new URL(API_TICKET_CATEGORIES, window.location.origin);
  if (pagination) {
    url.searchParams.set('page', pagination.page.toString());
    url.searchParams.set('size', pagination.size.toString());
  }
  if (q) {
    url.searchParams.set('q', q);
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

export const getTicketCategory = async (id: string) => {
  try {
    const url = new URL(API_TICKET_CATEGORIES + '/' + id, window.location.origin);
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

export const createTicketCategory = async (data: PostTicketCategories) => {
  try {
    const result = await fetch(API_TICKET_CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
};

export const updateTicketCategory = async (payload: PutTicketCategories): Promise<TicketCategories> => {
  try {
    const result = await fetch(API_TICKET_CATEGORIES + '/' + payload.id, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
};


export const archiveTicketCategory = async (id: string): Promise<boolean> => {
  try {
    const result = await fetch(API_TICKET_CATEGORIES + '/' + id, {
      method: 'PUT',
      body: JSON.stringify({ status: BaseStatusEnumSchema.enum.archived, updatedAt: new Date().toISOString() }),
    });
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
};