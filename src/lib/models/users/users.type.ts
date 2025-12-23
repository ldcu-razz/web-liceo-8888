import type z from "zod";
import type { UserRolesEnumSchema, UsersSchema } from "./users.schema";

export type Users = z.infer<typeof UsersSchema>;
export type UserRolesEnum = z.infer<typeof UserRolesEnumSchema>;