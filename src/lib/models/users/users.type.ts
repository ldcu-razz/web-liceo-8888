import type z from "zod";
import type { DeleteUsersSchema, PaginatedUsersSchema, PostUsersSchema, PutUsersSchema, UserRolesEnumSchema, UsersSchema } from "./users.schema";

export type Users = z.infer<typeof UsersSchema>;
export type UserRolesEnum = z.infer<typeof UserRolesEnumSchema>;
export type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;
export type PostUsers = z.infer<typeof PostUsersSchema>;
export type PutUsers = z.infer<typeof PutUsersSchema>;
export type DeleteUsers = z.infer<typeof DeleteUsersSchema>;