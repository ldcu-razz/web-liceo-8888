import z from "zod";
import { UUIDSchema } from "../common/common.schema";
import { UserRolesEnumSchema, UsersSchema } from "../users/users.schema";

export const SessionSchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  access_token: z.string(),
  refresh_token: z.string(),
  user_agent: z.string(),
  expiredAt: z.number(),
  is_revoked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TokenPayloadSchema = z.object({
  userId: UUIDSchema,
  username: z.string(),
  role: UserRolesEnumSchema,
  sessionId: UUIDSchema,
});

export const UpdateSessionTokenSchema = z.object({
  id: UUIDSchema,
  access_token: z.string(),
  refresh_token: z.string(),
  expiredAt: z.number(),
});

export const LoginPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  user: UsersSchema.omit({ password: true }),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const LogoutResponseSchema = z.object({
  success: z.boolean(),
});