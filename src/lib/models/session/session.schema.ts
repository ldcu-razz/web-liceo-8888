import z from "zod";

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  user_agent: z.string(),
  expiredAt: z.number(),
  is_revoked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});