import { supabase } from '$lib/supabase/client';
import { TABLES } from '$lib/constants/tables.constants';
import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
import type { TotalTicketGraph } from '$lib/models/dashboard/graph/total-ticket.type';

export const GET = async ({ url }) => {
	const startDate = url.searchParams.get('startDate') || '';
	const endDate = url.searchParams.get('endDate') || '';

	// Validate date parameters
	if (!startDate || !endDate) {
		return new Response(JSON.stringify({ error: 'Both startDate and endDate are required' }), {
			status: 400
		});
	}

	// Query tickets within the date range
	const { data: tickets, error } = await supabase
		.from(TABLES.TICKETS)
		.select('createdAt, status')
		.gte('createdAt', startDate)
		.lte('createdAt', endDate);

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	// Get all possible statuses
	const statuses = TicketStatusesSchema.options;

	// Create a map to store counts by date
	const dateMap = new Map<string, Record<string, number>>();

	// Initialize dates between startDate and endDate
	const start = new Date(startDate);
	const end = new Date(endDate);

	for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
		const dateStr = date.toISOString().split('T')[0];
		const statusCounts: Record<string, number> = {};

		// Initialize all statuses with 0
		statuses.forEach((status) => {
			statusCounts[status] = 0;
		});

		dateMap.set(dateStr, statusCounts);
	}

	// Count tickets by date and status
	tickets?.forEach((ticket) => {
		const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
		const dateEntry = dateMap.get(ticketDate);

		if (dateEntry && ticket.status) {
			dateEntry[ticket.status] = (dateEntry[ticket.status] || 0) + 1;
		}
	});

	// Convert map to array format
	const data: TotalTicketGraph[] = Array.from(dateMap.entries()).map(([date, statusCounts]) => ({
		date,
		...statusCounts
	}));

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
