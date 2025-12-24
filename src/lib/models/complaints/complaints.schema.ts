import z from "zod";
import { UUIDSchema } from "../common/common.schema";

export const ComplaintPrioritiesSchema = z.enum(["low","lowest", "medium", "high", "highest"]);

export const ComplaintStatusesSchema = z.enum(["backlog", "ready", "in_progress", "in_review", "done", "archived"]);

export const ComplaintsSchema = z.object({
  id: UUIDSchema,
  complaint_category: UUIDSchema,
  code: z.string(),
  subject: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable().default(null),
  priority: ComplaintPrioritiesSchema.default(ComplaintPrioritiesSchema.enum.medium),
  status: ComplaintStatusesSchema.default(ComplaintStatusesSchema.enum.backlog),
  curent_department_assigned: UUIDSchema.nullable().default(null),
  current_user_assigned: UUIDSchema.nullable().default(null),
  created_by: UUIDSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});