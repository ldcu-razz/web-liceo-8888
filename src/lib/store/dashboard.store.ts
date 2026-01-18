import type { DashboardStats } from '$lib/models/dashboard/dashboard.type';
import type { TotalTicketGraph } from '$lib/models/dashboard/graph/total-ticket.type';
import type { GetTicket } from '$lib/models/tickets/tickets.type';
import { getDashboardStats, getTotalTicketsGraph } from '$lib/services/dashboard/dashboard.service';
import { getTickets } from '$lib/services/tickets/tickets.service';
import { writable, get } from 'svelte/store';
import { meStore } from './me.store';
import { UserRolesEnumSchema } from '$lib/models/users/users.schema';

export const dashboardStatsStore = writable<DashboardStats>();
export const dashboardStatsLoadingStore = writable<boolean>(false);
export const dashboardStatsErrorStore = writable<string | null>(null);

export const totalTicketsGraphStore = writable<TotalTicketGraph[]>([]);
export const totalTicketsGraphLoadingStore = writable<boolean>(false);
export const totalTicketsGraphErrorStore = writable<string | null>(null);

export const dashboardRecentTicketsStore = writable<GetTicket[]>([]);
export const dashboardRecentTicketsLoadingStore = writable<boolean>(false);
export const dashboardRecentTicketsErrorStore = writable<string | null>(null);

export const dashboardActions = {
	getDashboardStats: async () => {
		dashboardStatsLoadingStore.set(true);
		try {
			dashboardStatsErrorStore.set(null);
			const stats = await getDashboardStats();
			dashboardStatsStore.set(stats);
		} catch (error) {
			console.error(error);
			dashboardStatsErrorStore.set((error as Error).message);
		} finally {
			dashboardStatsLoadingStore.set(false);
		}
	},

	getTotalTicketsGraph: async (startDate: string, endData: string) => {
		totalTicketsGraphLoadingStore.set(true);
		try {
			totalTicketsGraphErrorStore.set(null);
			const graph = await getTotalTicketsGraph(startDate, endData);
			totalTicketsGraphStore.set(graph);
		} catch (error) {
			console.error(error);
			totalTicketsGraphErrorStore.set((error as Error).message);
		} finally {
			totalTicketsGraphLoadingStore.set(false);
		}
	},

	getRecentTickets: async () => {
		dashboardRecentTicketsLoadingStore.set(true);
		try {
			dashboardRecentTicketsErrorStore.set(null);
			const user = get(meStore);
			let departmentsAssignedIds: string[] | undefined;
			if (user?.role === UserRolesEnumSchema.enum.department_staff && user.department_id) {
				departmentsAssignedIds = [user.department_id];
			}
			const tickets = await getTickets({ page: 1, size: 15 }, undefined, departmentsAssignedIds);
			dashboardRecentTicketsStore.set(tickets.data);
		} catch (error) {
			console.error(error);
			dashboardRecentTicketsErrorStore.set((error as Error).message);
		} finally {
			dashboardRecentTicketsLoadingStore.set(false);
		}
	},

	reset: async () => {
		dashboardStatsStore.set({
			total_tickets: 0,
			total_resolved_tickets: 0,
			total_active_accounts: 0,
			total_active_departments: 0
		});
		dashboardStatsLoadingStore.set(false);
		dashboardStatsErrorStore.set(null);
		totalTicketsGraphStore.set([]);
		totalTicketsGraphLoadingStore.set(false);
		totalTicketsGraphErrorStore.set(null);
		dashboardRecentTicketsStore.set([]);
		dashboardRecentTicketsLoadingStore.set(false);
		dashboardRecentTicketsErrorStore.set(null);
	}
};
