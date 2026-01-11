import type z from 'zod';
import type { TotalTicketGraphSchema } from './total-ticket.schema';

export type TotalTicketGraph = z.infer<typeof TotalTicketGraphSchema>;
