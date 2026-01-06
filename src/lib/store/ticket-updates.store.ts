import { get, writable } from "svelte/store";
import { getCreateTicketRemarkMessage, getCreateTicketTitle, getDepartmentAssignRemarkMessage, getDepartmentAssignTitle, getPriorityChangeRemarkMessage, getPriorityChangeTitle, getStatusChangeRemarkMessage, getStatusChangeTitle, getTicketsUpdates, getUserAssignRemarkMessage, getUserAssignTitle, postTicketsUpdates } from "$lib/services/tickets/tickets-updates.service";
import type { Pagination } from "$lib/models/common/common.type";
import type { PostTicketsUpdates, TicketsUpdates } from "$lib/models/tickets/tickets-updates.type";
import { TicketsUpdatesTypesSchema } from "$lib/models/tickets/tickets-updates.schema";
import { meStore } from "./me.store";
import { uuid } from "$lib/utils/uuid.util";
import type { TicketsPriorities, TicketStatuses } from "$lib/models/tickets/tickets.type";

export const ticketsUpdatesStore = writable<TicketsUpdates[]>([]);
export const ticketsUpdatesActiveTicketIdStore = writable<string>('');
export const ticketUpdatesLoadingStore = writable<boolean>(false);

export const ticketsUpdatesPagination = writable<Pagination>({ page: 1, size: 20 });

export const ticketUpdatesActions = {
  getTicketsUpdates: async (ticketId: string, pagination?: Pagination) => {
    try {
      ticketsUpdatesActiveTicketIdStore.set(ticketId);
      ticketUpdatesLoadingStore.set(true);
      const data = await getTicketsUpdates(pagination, ticketId);
      ticketsUpdatesStore.set(data.data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      ticketUpdatesLoadingStore.set(false);
    }
  },

  postTicketsUpdates: async (body: PostTicketsUpdates) => {
    try {
      const data = await postTicketsUpdates(body);
      ticketsUpdatesStore.update(prev => [data, ...prev]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCreateTicketPostBody: async (ticketId: string, assignedId: string): Promise<PostTicketsUpdates> => {
    const me = get(meStore);
    return {
      id: uuid(),
      ticket_id: ticketId,
      assigned_id: assignedId || null,
      type: TicketsUpdatesTypesSchema.enum.create_ticket,
      title: await getCreateTicketTitle(),
      message: await getCreateTicketRemarkMessage(me?.id || ''),
      updated_at: new Date().toISOString(),
      updated_by: me?.id || '',
    }
  },

  getDepartmentAssignPostBody: async (ticketId: string, departmentId: string): Promise<PostTicketsUpdates> => {
    const me = get(meStore);
    const assigned_id = departmentId || null;
    return {
      id: uuid(),
      ticket_id: ticketId,
      assigned_id: assigned_id,
      type: TicketsUpdatesTypesSchema.enum.department_assign,
      title: await getDepartmentAssignTitle(),
      message: await getDepartmentAssignRemarkMessage(departmentId, me?.id || ''),
      updated_at: new Date().toISOString(),
      updated_by: me?.id || '',
    }
  },

  getUserAssignPostBody: async (ticketId: string, userId: string): Promise<PostTicketsUpdates> => {
    const me = get(meStore);
    const assigned_id = userId || null;
    return {
      id: uuid(),
      ticket_id: ticketId,
      assigned_id: assigned_id,
      type: TicketsUpdatesTypesSchema.enum.user_assign,
      title: await getUserAssignTitle(),
      message: await getUserAssignRemarkMessage(userId, me?.id || ''),
      updated_at: new Date().toISOString(),
      updated_by: me?.id || '',
    }
  },

  getPriorityChangePostBody: async (ticketId: string, departmentId: string, priority: TicketsPriorities): Promise<PostTicketsUpdates> => {
    const me = get(meStore);
    const assigned_id = departmentId || null;
    return {
      id: uuid(),
      ticket_id: ticketId,
      assigned_id,
      type: TicketsUpdatesTypesSchema.enum.priority_change,
      title: await getPriorityChangeTitle(),
      message: await getPriorityChangeRemarkMessage(priority, me?.id || ''),
      updated_at: new Date().toISOString(),
      updated_by: me?.id || '',
    }
  },

  getStatusChangePostBody: async (ticketId: string, departmentId: string, status: TicketStatuses): Promise<PostTicketsUpdates> => {
    const me = get(meStore);
    const assigned_id = departmentId || null;
    return {
      id: uuid(),
      ticket_id: ticketId,
      assigned_id,
      type: TicketsUpdatesTypesSchema.enum.status_change,
      title: await getStatusChangeTitle(),
      message: await getStatusChangeRemarkMessage(status, me?.id || ''),
      updated_at: new Date().toISOString(),
      updated_by: me?.id || '',
    }
  },
}