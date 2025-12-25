import z from "zod";

export const BaseStatusEnumSchema = z.enum(["active", "inactive", "archived"]);

export const UUIDSchema = z.string().uuid();

export const SexEnumSchema = z.enum(["male", "female"]);

export const PaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
});

export const PaginatedSchema = z.object({
  count: z.number(),
  page: z.number(),
  size: z.number(),
});