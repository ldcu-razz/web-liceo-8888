import type z from "zod";
import type { SessionSchema } from "./session.schema";

export type Session = z.infer<typeof SessionSchema>;