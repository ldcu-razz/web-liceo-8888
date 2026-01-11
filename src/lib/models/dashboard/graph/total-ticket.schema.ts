import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
import z from 'zod';

export const TotalTicketGraphSchema = z.object({
	date: z.string(),
	...Object.fromEntries(TicketStatusesSchema.options.map((status) => [status, z.number()]))
});
