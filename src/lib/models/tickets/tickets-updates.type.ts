import type z from "zod";
import type { GetTicketsUpdatesSchema, GetTicketsUpdatesPaginatedSchema, PostTicketsUpdatesSchema, PutTicketsUpdatesSchema, TicketsUpdatesSchema } from "./tickets-updates.schema";

export type TicketsUpdates = z.infer<typeof TicketsUpdatesSchema>;
export type PostTicketsUpdates = z.infer<typeof PostTicketsUpdatesSchema>;
export type PutTicketsUpdates = z.infer<typeof PutTicketsUpdatesSchema>;
export type GetTicketsUpdates = z.infer<typeof GetTicketsUpdatesSchema>;
export type GetTicketsUpdatesPaginated = z.infer<typeof GetTicketsUpdatesPaginatedSchema>;