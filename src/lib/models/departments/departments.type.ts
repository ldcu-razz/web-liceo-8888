import type z from "zod";
import type { DepartmentsSchema, PaginatedDepartmentsSchema } from "./departments.schema";

export type Departments = z.infer<typeof DepartmentsSchema>;
export type PaginatedDepartments = z.infer<typeof PaginatedDepartmentsSchema>;