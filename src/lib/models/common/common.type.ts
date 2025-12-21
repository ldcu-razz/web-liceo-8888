import type z from "zod";
import type { BaseStatusEnumSchema, UUIDSchema } from "./common.schema";

export type BaseStatusEnum = z.infer<typeof BaseStatusEnumSchema>;

export type UUID = z.infer<typeof UUIDSchema>;