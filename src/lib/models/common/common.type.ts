import type z from "zod";
import type { BaseStatusEnumSchema, PaginatedSchema, PaginationSchema, SexEnumSchema, UUIDSchema } from "./common.schema";

export type BaseStatusEnum = z.infer<typeof BaseStatusEnumSchema>;

export type UUID = z.infer<typeof UUIDSchema>;

export type SexEnum = z.infer<typeof SexEnumSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;

export type PaginatedData = z.infer<typeof PaginatedSchema>;