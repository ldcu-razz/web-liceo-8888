import z from 'zod';

export const DashboardStatsSchema = z.object({
	total_tickets: z.number(),
	total_resolved_tickets: z.number(),
	total_active_accounts: z.number(),
	total_active_departments: z.number()
});
