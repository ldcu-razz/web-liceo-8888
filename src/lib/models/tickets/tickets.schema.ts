import z from "zod";
import { UUIDSchema } from "../common/common.schema";

export const TicketsPrioritiesSchema = z.enum(["low","lowest", "medium", "high", "highest"]);

export const TicketStatusesSchema = z.enum(["backlog", "ready", "in_progress", "in_review", "done", "archived"]);

export const TicketSchema = z.object({
  id: UUIDSchema,
  category: UUIDSchema,
  code: z.string(),
  subject: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable().default(null),
  priority: TicketsPrioritiesSchema.default(TicketsPrioritiesSchema.enum.medium),
  status: TicketStatusesSchema.default(TicketStatusesSchema.enum.backlog),
  curent_department_assigned: UUIDSchema.nullable().default(null),
  current_user_assigned: UUIDSchema.nullable().default(null),
  created_by: UUIDSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});