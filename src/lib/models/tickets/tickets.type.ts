import type z from "zod";
import type { TicketsPrioritiesSchema, TicketSchema, TicketStatusesSchema, GetTicketSchema, GetTicketsPaginatedSchema, PostTicketSchema, PutTicketSchema } from "./tickets.schema";

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketsPriorities = z.infer<typeof TicketsPrioritiesSchema>;
export type TicketStatuses = z.infer<typeof TicketStatusesSchema>;
export type GetTicket = z.infer<typeof GetTicketSchema>;
export type GetTicketsPaginated = z.infer<typeof GetTicketsPaginatedSchema>;
export type PostTicket = z.infer<typeof PostTicketSchema>;
export type PutTicket = z.infer<typeof PutTicketSchema>;
