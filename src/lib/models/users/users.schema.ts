import z from "zod";
import { SexEnumSchema, UUIDSchema } from "../common/common.schema";

export const UserRolesEnumSchema = z.enum(["super_admin", "admin", "user"]);

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
  createdAt: z.string(),
  updatedAt: z.string(),
});