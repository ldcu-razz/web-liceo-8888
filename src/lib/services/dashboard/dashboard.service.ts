import { API_DASHBOARD_STATS, API_DASHBOARD_TICKETS_GRAPH } from '$lib/constants/routes.constants';
import type { DashboardStats } from '$lib/models/dashboard/dashboard.type';
import type { TotalTicketGraph } from '$lib/models/dashboard/graph/total-ticket.type';
import { requestFetch } from '../request/request.service';

export const getDashboardStats = async (): Promise<DashboardStats> => {
	try {
		const url = new URL(API_DASHBOARD_STATS, window.location.origin);
		const response = await requestFetch(url.toString());
		if (!response.ok) {
			throw new Error('Failed to fetch dashboard stats');
		}
		return response.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
};

export const getTotalTicketsGraph = async (
	startDate: string,
	endData: string
): Promise<TotalTicketGraph[]> => {
	try {
		const url = new URL(API_DASHBOARD_TICKETS_GRAPH, window.location.origin);

		if (startDate) {
			url.searchParams.set('startDate', startDate);
		}
		if (endData) {
			url.searchParams.set('endDate', endData);
		}

		const response = await requestFetch(url.toString());
		if (!response.ok) {
			throw new Error('Failed to fetch total tickets graph');
		}
		return response.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
};
