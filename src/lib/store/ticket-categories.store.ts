import { derived, get, writable } from "svelte/store";
import type { PostTicketCategories, PutTicketCategories, TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";
import type { Pagination } from "$lib/models/common/common.type";
import { archiveTicketCategory, createTicketCategory, getTicketCategories, updateTicketCategory } from "$lib/services/tickets/ticket-categories.service";
import { toast } from "svelte-sonner";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";

export const ticketCategoriesStore = writable<TicketCategories[]>([]);
export const ticketCategoriesLoading = writable<boolean>(false);
export const ticketCategoriesError = writable<string | null>(null);
export const ticketCategoriesPagination = writable<Pagination>({
  page: 1,
  size: 15,
});
export const ticketCategoriesTotalCount = writable<number>(0);

export const ticketCategoriesAll = writable<TicketCategories[]>([]);

export const ticketCategoriesNonArchivedStore = derived(ticketCategoriesAll, (all) => all.filter(c => c.status !== BaseStatusEnumSchema.enum.archived));

export const ticketCategoriesActions = {
  getAllTicketCategories: async () => {
    try {
      const data = await getTicketCategories();
      ticketCategoriesAll.set(data.data);
    } catch (error) {
      console.error(error);
    }
  },

  getTicketCategories: async (pagination: Pagination, q?: string, silentLoading?: boolean) => {
    try {
      if (!silentLoading) {
        ticketCategoriesLoading.set(true);
      }

      ticketCategoriesPagination.set(pagination);

      const data = await getTicketCategories(pagination, q);

      ticketCategoriesLoading.set(false);
      ticketCategoriesStore.set(data.data);
      ticketCategoriesPagination.update(prev => ({ ...prev, page: pagination.page, size: pagination.size }));
      ticketCategoriesTotalCount.update(() => data.count);
    } catch (error) {
      console.error(error);
      ticketCategoriesError.set((error as Error).message);
      ticketCategoriesLoading.set(false);
    }
  },

  createTicketCategory: async (payload: PostTicketCategories) => {
    const toastId = toast.loading(`Creating ticket category...`);
    try {
      ticketCategoriesStore.update(prev => [payload, ...prev]);
      ticketCategoriesAll.update(prev => [payload, ...prev]);
      await createTicketCategory(payload);
      toast.success(`Ticket category created successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      ticketCategoriesStore.set(get(ticketCategoriesStore).filter(c => c.id !== payload.id));
      ticketCategoriesError.set((error as Error).message);
      toast.error(`Failed to create ticket category`, { id: toastId });
    }
  },

  updateTicketCategory: async (id: string, payload: PutTicketCategories) => {
    const toastId = toast.loading(`Updating ticket category...`);
    const currentUpdatedTicketCategory = get(ticketCategoriesStore).find(c => c.id === id);
    try {
      await updateTicketCategory(payload);
      toast.success(`Ticket category updated successfully`, { id: toastId });
      ticketCategoriesStore.update(prev => prev.map(c => c.id === id ? {...c, ...payload} : c));
      ticketCategoriesAll.update(prev => prev.map(c => c.id === id ? {...c, ...payload} : c));
    } catch (error) {
      console.error(error);
      if (currentUpdatedTicketCategory) {
        ticketCategoriesStore.update(prev => prev.map(c => c.id === id ? {...currentUpdatedTicketCategory} : c));
      }
      ticketCategoriesError.set((error as Error).message);
    }
  },

  archiveTicketCategory: async (id: string) => {
    const toastId = toast.loading(`Archiving ticket category...`);
    const currentArchivedTicketCategory = get(ticketCategoriesStore).find(c => c.id === id);
    try {
      const updatedAt = new Date().toISOString();
      ticketCategoriesStore.update(prev => prev.map(c => c.id === id ? {...c, status: BaseStatusEnumSchema.enum.archived, updatedAt} : c));
      ticketCategoriesAll.update(prev => prev.map(c => c.id === id ? {...c, status: BaseStatusEnumSchema.enum.archived, updatedAt} : c));
      await archiveTicketCategory(id);
      toast.success(`Ticket category archived successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      ticketCategoriesError.set((error as Error).message);
      if (currentArchivedTicketCategory) {
        ticketCategoriesStore.update(prev => prev.map(c => c.id === id ? {...currentArchivedTicketCategory} : c));
      }
      toast.error(`Failed to archive ticket category`, { id: toastId });
    }
  }
}