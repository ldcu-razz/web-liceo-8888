import type { Pagination } from '$lib/models/common/common.type';
import type {
	GetTicket,
	PostTicket,
	PutTicket,
	TicketsPriorities,
	TicketStatuses
} from '$lib/models/tickets/tickets.type';
import {
	createTicket,
	deleteTicket,
	getTicket,
	getTickets,
	updateTicket
} from '$lib/services/tickets/tickets.service';
import { toast } from 'svelte-sonner';
import { get, writable } from 'svelte/store';
import { ticketUpdatesActions } from './ticket-updates.store';
import { getRoute } from '$lib/utils/routes.utils';
import { TICKETS_DETAILS } from '$lib/constants/routes.constants';
import { notificationsActions } from './notifications.store';
import { meStore } from './me.store';
import { UserRolesEnumSchema } from '$lib/models/users/users.schema';
import { departmentsStore } from './departments.store';

export const ticketsStore = writable<GetTicket[]>([]);
export const ticketsPagination = writable<Pagination>({ page: 1, size: 20 });
export const ticketsTotalCount = writable<number>(0);
export const ticketsLoading = writable<boolean>(false);
export const ticketsError = writable<string | null>(null);

export const currentTicket = writable<GetTicket | null>(null);
export const currentTicketLoading = writable<boolean>(false);
export const currentTicketError = writable<string | null>(null);

export const ticketsActions = {
	getTickets: async (
		pagination: Pagination,
		q?: string,
		departmentsAssignedIds?: string[],
		usersAssignedIds?: string[],
		reportedByIds?: string[],
		status?: TicketStatuses[],
		silentLoading?: boolean
	) => {
		if (!silentLoading) {
			ticketsLoading.set(true);
		}
		try {
			ticketsPagination.set(pagination);

			const data = await getTickets(
				pagination,
				q,
				departmentsAssignedIds,
				usersAssignedIds,
				reportedByIds,
				status
			);
			ticketsStore.set(data.data);

			ticketsPagination.update((prev) => ({
				...prev,
				page: pagination.page,
				size: pagination.size
			}));
			ticketsTotalCount.update(() => data.count);
		} catch (error) {
			console.error(error);
			ticketsError.set((error as Error).message);
		} finally {
			ticketsLoading.set(false);
		}
	},

	getTicket: async (id: string) => {
		currentTicketLoading.set(true);
		try {
			const data = await getTicket(id);
			currentTicket.set(data);
		} catch (error) {
			console.error(error);
			currentTicketError.set((error as Error).message);
		} finally {
			currentTicketLoading.set(false);
		}
	},

	createTicket: async (ticket: PostTicket) => {
		const toastId = toast.loading(`Creating ticket...`);
		try {
			const data = await createTicket(ticket);
			toast.success(`Ticket created successfully`, { id: toastId });
			ticketsStore.set([data, ...get(ticketsStore)]);

			// For ticket updates
			const assignedId =
				data.current_department_assigned?.id || data.current_user_assigned?.id || '';
			const postBody = await ticketUpdatesActions.getCreateTicketPostBody(data.id, assignedId);
			ticketUpdatesActions.postTicketsUpdates(postBody);

			// For notifications
			const me = get(meStore);
			const isMeUserRole = me?.role === UserRolesEnumSchema.enum.user;
			if (isMeUserRole) {
				notificationsActions.createTicketCreatedNotification(data);
			}
		} catch (error) {
			console.error(error);
			ticketsError.set((error as Error).message);
			ticketsStore.set(get(ticketsStore).filter((t) => t.id !== ticket.id));
			toast.error(`Failed to create ticket`, { id: toastId });
		}
	},

	updateTicket: async (id: string, ticket: PutTicket) => {
		const toastId = toast.loading(`Updating ticket...`);
		try {
			const data = await updateTicket(id, ticket);
			toast.success(`Ticket updated successfully`, { id: toastId });
			ticketsStore.update((prev) => prev.map((t) => (t.id === id ? data : t)));
		} catch (error) {
			console.error(error);
			ticketsError.set((error as Error).message);
			toast.error(`Failed to update ticket`, { id: toastId });
		}
	},

	updateTicketDescription: async (id: string, description: string) => {
		const toastId = toast.loading(`Updating ticket description...`);
		const currentTicket = get(ticketsStore).find((t) => t.id === id);
		try {
			const updatedTicket = { description, updatedAt: new Date().toISOString() };
			ticketsStore.update((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...updatedTicket } : t))
			);
			await updateTicket(id, updatedTicket);
			toast.success(`Ticket description updated successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			if (currentTicket) {
				ticketsStore.update((prev) => prev.map((t) => (t.id === id ? { ...currentTicket } : t)));
			}
			toast.error(`Failed to update ticket description`, { id: toastId });
		}
	},

	changeTicketStatus: async (id: string, status: TicketStatuses) => {
		const toastId = toast.loading(`Updating ticket status...`);
		const currentTicket = get(ticketsStore).find((t) => t.id === id);
		try {
			ticketsStore.update((prev) =>
				prev.map((t) => (t.id === id ? { ...currentTicket!, status } : t))
			);
			const updatedTicket = await updateTicket(id, { status, updatedAt: new Date().toISOString() });
			toast.success(`Ticket status updated successfully`, { id: toastId });

			// For ticket updates
			const currentDepartmentAssigned = currentTicket?.current_department_assigned?.id || '';
			const postBody = await ticketUpdatesActions.getStatusChangePostBody(
				id,
				currentDepartmentAssigned,
				status
			);
			ticketUpdatesActions.postTicketsUpdates(postBody);

			// For notifications
			// TODO: Send the notification to users participating in the ticket
			const me = get(meStore);
			const isMeUserRole = me?.role === UserRolesEnumSchema.enum.user;
			if (!isMeUserRole) {
				notificationsActions.createTicketStatusChangedNotification(updatedTicket);
			}
		} catch (error) {
			console.error(error);
			if (currentTicket) {
				ticketsStore.update((prev) => prev.map((t) => (t.id === id ? { ...currentTicket } : t)));
			}
			toast.error(`Failed to update ticket status`, { id: toastId });
		}
	},

	changeAssignedUser: async (id: string, userId: string) => {
		const toastId = toast.loading(`Updating ticket assigned user...`);
		const currentTicket = get(ticketsStore).find((t) => t.id === id);
		try {
			const current_user_assigned = userId || null;
			const data = await updateTicket(id, {
				current_user_assigned,
				updatedAt: new Date().toISOString()
			});
			ticketsStore.update((prev) => prev.map((t) => (t.id === id ? data : t)));
			toast.success(`Ticket assigned user updated successfully`, { id: toastId });

			// For ticket updates
			const postBody = await ticketUpdatesActions.getUserAssignPostBody(id, userId);
			ticketUpdatesActions.postTicketsUpdates(postBody);

			// For notifications
			const me = get(meStore);
			const isMeUserRole = me?.role === UserRolesEnumSchema.enum.user;
			if (!isMeUserRole) {
				notificationsActions.createUserAssignedTicketNotification(data);
			}
		} catch (error) {
			console.error(error);
			if (currentTicket) {
				ticketsStore.update((prev) => prev.map((t) => (t.id === id ? { ...currentTicket } : t)));
			}
			toast.error(`Failed to update ticket assigned user`, { id: toastId });
		}
	},

	changeAssignedDepartment: async (id: string, departmentId: string) => {
		const toastId = toast.loading(`Updating ticket assigned department...`);
		const currentTicket = get(ticketsStore).find((t) => t.id === id);
		try {
			const current_department_assigned = departmentId || null;
			const data = await updateTicket(id, {
				current_department_assigned,
				updatedAt: new Date().toISOString()
			});
			ticketsStore.update((prev) => prev.map((t) => (t.id === id ? data : t)));
			toast.success(`Ticket assigned department updated successfully`, { id: toastId });

			// For ticket updates
			const postBody = await ticketUpdatesActions.getDepartmentAssignPostBody(id, departmentId);
			ticketUpdatesActions.postTicketsUpdates(postBody);

			// For notifications
			const me = get(meStore);
			const isMeUserRole = me?.role === UserRolesEnumSchema.enum.user;
			const department = get(departmentsStore).find((d) => d.id === departmentId);
			if (!isMeUserRole && department) {
				notificationsActions.createTicketDepartmentAssignedNotification(data, department);
			}
		} catch (error) {
			console.error(error);
			if (currentTicket) {
				ticketsStore.update((prev) => prev.map((t) => (t.id === id ? { ...currentTicket } : t)));
			}
			toast.error(`Failed to update ticket assigned department`, { id: toastId });
		}
	},

	changeTicketPriority: async (id: string, priority: TicketsPriorities) => {
		const toastId = toast.loading(`Updating ticket priority...`);
		const currentTicket = get(ticketsStore).find((t) => t.id === id);
		try {
			const data = await updateTicket(id, { priority, updatedAt: new Date().toISOString() });
			ticketsStore.update((prev) => prev.map((t) => (t.id === id ? data : t)));
			toast.success(`Ticket priority updated successfully`, { id: toastId });

			const currentDepartmentAssigned = currentTicket?.current_department_assigned;
			const postBody = await ticketUpdatesActions.getPriorityChangePostBody(
				id,
				currentDepartmentAssigned?.id || '',
				priority
			);
			ticketUpdatesActions.postTicketsUpdates(postBody);
		} catch (error) {
			console.error(error);
			if (currentTicket) {
				ticketsStore.update((prev) => prev.map((t) => (t.id === id ? { ...currentTicket } : t)));
			}
			toast.error(`Failed to update ticket priority`, { id: toastId });
		}
	},

	deleteTicket: async (id: string) => {
		const toastId = toast.loading(`Deleting ticket...`);
		try {
			await deleteTicket(id);
			toast.success(`Ticket deleted successfully`, { id: toastId });
			ticketsStore.update((prev) => prev.filter((t) => t.id !== id));
		} catch (error) {
			console.error(error);
			toast.error(`Failed to delete ticket`, { id: toastId });
		}
	},

	copyTicketLink: async (id: string) => {
		const toastId = toast.loading(`Copying ticket link...`);
		try {
			const link = window.location.origin + `${getRoute(TICKETS_DETAILS, { id })}`;
			await navigator.clipboard.writeText(link);
			toast.success(`Ticket link copied successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error(`Failed to copy ticket link`, { id: toastId });
		}
	}
};
