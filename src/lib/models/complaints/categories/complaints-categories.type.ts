import type z from "zod";
import type { ComplaintsCategoriesSchema } from "./complaints-categories.schema";

export type ComplaintsCategories = z.infer<typeof ComplaintsCategoriesSchema>;