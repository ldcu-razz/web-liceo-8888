import { SidebarItemSchema, SidebarSchema } from "./sidebar.schema";
import { z } from "zod";

export type SidebarItemModel = z.infer<typeof SidebarItemSchema>;
export type SidebarModel = z.infer<typeof SidebarSchema>;
