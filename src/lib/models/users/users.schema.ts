import z from "zod";
import { BaseStatusEnumSchema, PaginatedSchema, SexEnumSchema, UUIDSchema } from "../common/common.schema";

export const UserRolesEnumSchema = z.enum(["super_admin", "admin", "user", "department_staff"]);

export const UsersSchema = z.object({
  id: UUIDSchema,
  rfid_number: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  sex: SexEnumSchema,
  birthdate: z.string(),
  email: z.string(),
  contact_number: z.string(),
  username: z.string(),
  password: z.string(),
  role: UserRolesEnumSchema,
  department_id: UUIDSchema,
  status: BaseStatusEnumSchema,
  avatar: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PaginatedUsersSchema = PaginatedSchema.extend({
  data: z.array(UsersSchema),
});

export const PostUsersSchema = UsersSchema;

export const PutUsersSchema = UsersSchema.partial();

export const DeleteUsersSchema = UsersSchema.pick({ id: true });