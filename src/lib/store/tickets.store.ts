import type { Pagination } from "$lib/models/common/common.type";
import type { GetTicket, PostTicket, PutTicket, TicketsPriorities, TicketStatuses } from "$lib/models/tickets/tickets.type";
import { createTicket, getTicket, getTickets, updateTicket } from "$lib/services/tickets/tickets.service";
import { toast } from "svelte-sonner";
import { get, writable } from "svelte/store";

export const ticketsStore = writable<GetTicket[]>([]);
export const ticketsPagination = writable<Pagination>({ page: 1, size: 20 });
export const ticketsTotalCount = writable<number>(0);
export const ticketsLoading = writable<boolean>(false);
export const ticketsError = writable<string | null>(null);

export const currentTicket = writable<GetTicket | null>(null);
export const currentTicketLoading = writable<boolean>(false);
export const currentTicketError = writable<string | null>(null);

export const ticketsActions = {
  getTickets: async (pagination: Pagination, q?: string, departmentAssignedId?: string, userAssignedId?: string) => {
    ticketsLoading.set(true);
    try {
      ticketsPagination.set(pagination);

      const data = await getTickets(pagination, q, departmentAssignedId, userAssignedId);
      ticketsStore.set(data.data);

      ticketsPagination.update(prev => ({ ...prev, page: pagination.page, size: pagination.size }));
      ticketsTotalCount.update(() => data.count);
    } catch (error) {
      console.error(error);
      ticketsError.set((error as Error).message);
    } finally {
      ticketsLoading.set(false);
    }
  },

  getTicket: async (id: string) => {
    try {
      currentTicketLoading.set(true);
      const data = await getTicket(id);
      currentTicket.set(data);
    } catch (error) {
      console.error(error);
      currentTicketError.set((error as Error).message);
      currentTicketLoading.set(false);
    }
  },

  createTicket: async (ticket: PostTicket) => {
    const toastId = toast.loading(`Creating ticket...`);
    try {
      const data = await createTicket(ticket);
      toast.success(`Ticket created successfully`, { id: toastId });
      ticketsStore.set([data, ...get(ticketsStore)]);
    } catch (error) {
      console.error(error);
      ticketsError.set((error as Error).message);
      ticketsStore.set(get(ticketsStore).filter(t => t.id !== ticket.id));
      toast.error(`Failed to create ticket`, { id: toastId });
    }
  },

  updateTicket: async (id: string, ticket: PutTicket) => {
    const toastId = toast.loading(`Updating ticket...`);
    try {
      const data = await updateTicket(id, ticket);
      toast.success(`Ticket updated successfully`, { id: toastId });
      ticketsStore.update(prev => prev.map(t => t.id === id ? data : t));
    } catch (error) {
      console.error(error);
      ticketsError.set((error as Error).message);
      toast.error(`Failed to update ticket`, { id: toastId });
    }
  },

  changeTicketStatus: async (id: string, status: TicketStatuses) => {
    const toastId = toast.loading(`Updating ticket status...`);
    const currentTicket = get(ticketsStore).find(t => t.id === id);
    try {
      ticketsStore.update(prev => prev.map(t => t.id === id ? {...currentTicket!, status} : t));
      await updateTicket(id, { status, updatedAt: new Date().toISOString() });
      toast.success(`Ticket status updated successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentTicket) {
        ticketsStore.update(prev => prev.map(t => t.id === id ? {...currentTicket} : t));
      }
      toast.error(`Failed to update ticket status`, { id: toastId });
    }
  },

  changeAssignedUser: async (id: string, userId: string) => {
    const toastId = toast.loading(`Updating ticket assigned user...`);
    const currentTicket = get(ticketsStore).find(t => t.id === id);
    try {
      const data = await updateTicket(id, { current_user_assigned: userId, updatedAt: new Date().toISOString() });
      ticketsStore.update(prev => prev.map(t => t.id === id ? data : t));
      toast.success(`Ticket assigned user updated successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentTicket) {
        ticketsStore.update(prev => prev.map(t => t.id === id ? {...currentTicket} : t));
      }
      toast.error(`Failed to update ticket assigned user`, { id: toastId });
    }
  },

  changeAssignedDepartment: async (id: string, departmentId: string) => {
    const toastId = toast.loading(`Updating ticket assigned department...`);
    const currentTicket = get(ticketsStore).find(t => t.id === id);
    try {
      const data = await updateTicket(id, { current_department_assigned: departmentId, updatedAt: new Date().toISOString() });
      ticketsStore.update(prev => prev.map(t => t.id === id ? data : t));
      toast.success(`Ticket assigned department updated successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentTicket) {
        ticketsStore.update(prev => prev.map(t => t.id === id ? {...currentTicket} : t));
      }
      toast.error(`Failed to update ticket assigned department`, { id: toastId });
    }
  },

  changeTicketPriority: async (id: string, priority: TicketsPriorities) => {
    const toastId = toast.loading(`Updating ticket priority...`);
    const currentTicket = get(ticketsStore).find(t => t.id === id);
    try {
      const data = await updateTicket(id, { priority, updatedAt: new Date().toISOString() });
      ticketsStore.update(prev => prev.map(t => t.id === id ? data : t));
      toast.success(`Ticket priority updated successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentTicket) {
        ticketsStore.update(prev => prev.map(t => t.id === id ? {...currentTicket} : t));
      }
      toast.error(`Failed to update ticket priority`, { id: toastId });
    }
  }
}