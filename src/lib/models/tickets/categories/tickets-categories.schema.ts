import { BaseStatusEnumSchema, PaginatedSchema, UUIDSchema } from "$lib/models/common/common.schema";
import z from "zod";

export const TicketCategoriesSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  department_id: UUIDSchema.optional().nullable(),
  status: BaseStatusEnumSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TicketCategoriesPaginatedSchema = PaginatedSchema.extend({
  data: z.array(TicketCategoriesSchema),
});

export const PostTicketCategoriesSchema = TicketCategoriesSchema;

export const PutTicketCategoriesSchema = TicketCategoriesSchema.partial();

export const DeleteTicketCategoriesSchema = z.object({
  id: UUIDSchema,
});

export const GetTicketCategoriesSchema = z.object({
  id: UUIDSchema,
});