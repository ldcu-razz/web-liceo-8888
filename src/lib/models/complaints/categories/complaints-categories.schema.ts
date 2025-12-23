import { BaseStatusEnumSchema, UUIDSchema } from "$lib/models/common/common.schema";
import z from "zod";

export const ComplaintsCategoriesSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  default_department: UUIDSchema.optional().nullable(),
  status: BaseStatusEnumSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});