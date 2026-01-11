import { TABLES } from '$lib/constants/tables.constants';
import { BaseStatusEnumSchema } from '$lib/models/common/common.schema';
import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
import { supabase } from '$lib/supabase/client';

export const GET = async () => {
	const { count: totalTickets, error: totalTicketsError } = await supabase
		.from(TABLES.TICKETS)
		.select('*', { count: 'exact', head: true });
	if (totalTicketsError) {
		return new Response(JSON.stringify({ error: totalTicketsError.message }), { status: 500 });
	}

	const { count: totalResolvedTickets, error: totalResolvedTicketsError } = await supabase
		.from(TABLES.TICKETS)
		.select('*', { count: 'exact', head: true })
		.eq('status', TicketStatusesSchema.enum.done);
	if (totalResolvedTicketsError) {
		return new Response(JSON.stringify({ error: totalResolvedTicketsError.message }), {
			status: 500
		});
	}

	const { count: totalActiveAccounts, error: totalActiveAccountsError } = await supabase
		.from(TABLES.USERS)
		.select('*', { count: 'exact', head: true })
		.eq('status', BaseStatusEnumSchema.enum.active);
	if (totalActiveAccountsError) {
		return new Response(JSON.stringify({ error: totalActiveAccountsError.message }), {
			status: 500
		});
	}

	const { count: totalActiveDepartments, error: totalActiveDepartmentsError } = await supabase
		.from(TABLES.DEPARTMENTS)
		.select('*', { count: 'exact', head: true })
		.eq('status', BaseStatusEnumSchema.enum.active);
	if (totalActiveDepartmentsError) {
		return new Response(JSON.stringify({ error: totalActiveDepartmentsError.message }), {
			status: 500
		});
	}

	const response = {
		total_tickets: totalTickets ?? 0,
		total_resolved_tickets: totalResolvedTickets ?? 0,
		total_active_accounts: totalActiveAccounts ?? 0,
		total_active_departments: totalActiveDepartments ?? 0
	};

	return new Response(JSON.stringify(response), { status: 200 });
};
