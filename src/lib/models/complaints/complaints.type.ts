import type z from "zod";
import type { ComplaintPrioritiesSchema, ComplaintsSchema, ComplaintStatusesSchema } from "./complaints.schema";

export type Complaints = z.infer<typeof ComplaintsSchema>;
export type ComplaintPriorities = z.infer<typeof ComplaintPrioritiesSchema>;
export type ComplaintStatuses = z.infer<typeof ComplaintStatusesSchema>;