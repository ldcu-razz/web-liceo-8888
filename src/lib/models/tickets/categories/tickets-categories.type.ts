import type z from "zod";
import type { DeleteTicketCategoriesSchema, GetTicketCategoriesSchema, PostTicketCategoriesSchema, PutTicketCategoriesSchema, TicketCategoriesPaginatedSchema, TicketCategoriesSchema } from "./tickets-categories.schema";

export type TicketCategories = z.infer<typeof TicketCategoriesSchema>;

export type PostTicketCategories = z.infer<typeof PostTicketCategoriesSchema>;

export type PutTicketCategories = z.infer<typeof PutTicketCategoriesSchema>;

export type DeleteTicketCategories = z.infer<typeof DeleteTicketCategoriesSchema>;

export type GetTicketCategories = z.infer<typeof GetTicketCategoriesSchema>;  

export type PaginatedTicketCategories = z.infer<typeof TicketCategoriesPaginatedSchema>;