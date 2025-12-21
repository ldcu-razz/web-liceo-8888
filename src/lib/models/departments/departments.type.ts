import type z from "zod";
import type { DepartmentsSchema } from "./departments.schema";

export type Departments = z.infer<typeof DepartmentsSchema>;