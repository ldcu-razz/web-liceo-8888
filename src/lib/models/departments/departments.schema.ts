import z from "zod";
import { BaseStatusEnumSchema, PaginatedSchema, UUIDSchema } from "../common/common.schema";

export const DepartmentsSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  abbv: z.string(),
  description: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
  avatar: z.string().optional().nullable(),
  status: BaseStatusEnumSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PaginatedDepartmentsSchema = PaginatedSchema.extend({
  data: z.array(DepartmentsSchema),
});