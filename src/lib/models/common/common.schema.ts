import z from "zod";

export const BaseStatusEnumSchema = z.enum(["active", "inactive", "archived"]);

export const UUIDSchema = z.string().uuid();