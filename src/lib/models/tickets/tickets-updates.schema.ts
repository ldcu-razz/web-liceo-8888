import z from "zod";
import { PaginatedSchema, UUIDSchema } from "../common/common.schema";

export const TicketsUpdatesTypesSchema = z.enum([
  'create_ticket',
  'department_assign',
  'user_assign',
  'status_change',
  'priority_change',
]);

export const TicketsUpdatesSchema = z.object({
  id: UUIDSchema,
  ticket_id: UUIDSchema,
  assigned_id: UUIDSchema.nullable(),
  type: TicketsUpdatesTypesSchema,
  title: z.string(),
  message: z.string(),
  updated_by: UUIDSchema,
  updated_at: z.string(),
});

export const PostTicketsUpdatesSchema = TicketsUpdatesSchema;

export const PutTicketsUpdatesSchema = TicketsUpdatesSchema.omit({ id: true }).partial();

export const GetTicketsUpdatesSchema =TicketsUpdatesSchema;

export const GetTicketsUpdatesPaginatedSchema = PaginatedSchema.extend({
  data: TicketsUpdatesSchema.array(),
});