import type z from "zod";
import type { TicketsPrioritiesSchema, TicketSchema, TicketStatusesSchema } from "./tickets.schema";

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketsPriorities = z.infer<typeof TicketsPrioritiesSchema>;
export type TicketStatuses = z.infer<typeof TicketStatusesSchema>;