import z from "zod";
import { PaginatedSchema, UUIDSchema } from "../common/common.schema";
import { TicketCategoriesSchema } from "./categories/tickets-categories.schema";
import { DepartmentsSchema } from "../departments/departments.schema";
import { UsersSchema } from "../users/users.schema";
import { FilesSchema } from "../files/files.schema";

export const TicketsPrioritiesSchema = z.enum(["highest", "high", "medium", "low", "lowest"]);

export const TicketStatusesSchema = z.enum(["backlog", "ready", "in_progress", "in_review", "done", "archived", "closed"]);

export const TicketSchema = z.object({
  id: UUIDSchema,
  category_id: UUIDSchema.nullable().default(null),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  priority: TicketsPrioritiesSchema.default(TicketsPrioritiesSchema.enum.medium),
  status: TicketStatusesSchema.default(TicketStatusesSchema.enum.backlog),
  current_department_assigned: UUIDSchema.nullable().default(""),
  current_user_assigned: UUIDSchema.nullable().default(""),
  reported_by: UUIDSchema.nullable().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PostTicketSchema = TicketSchema;

export const PutTicketSchema = PostTicketSchema.partial();

export const GetTicketSchema = TicketSchema.extend({
  category: TicketCategoriesSchema.pick({ id: true, name: true }),
  current_department_assigned: DepartmentsSchema.pick({ id: true, name: true, abbv: true }),
  current_user_assigned: UsersSchema.pick({ id: true, firstname: true, lastname: true, avatar: true }),
  reported_by: UsersSchema.pick({ id: true, firstname: true, lastname: true, avatar: true }),
  files: z.array(FilesSchema),
});

export const GetTicketsPaginatedSchema = PaginatedSchema.extend({
  data: z.array(GetTicketSchema),
});