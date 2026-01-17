import z from "zod";

export const PostEmailSchema = z.object({
  to: z.array(z.string()).default([]),
  subject: z.string(),
  html: z.string(),
  text: z.string(),
});