import type z from "zod";
import type { PostEmailSchema } from "./email.schema";

export type PostEmail = z.infer<typeof PostEmailSchema>;