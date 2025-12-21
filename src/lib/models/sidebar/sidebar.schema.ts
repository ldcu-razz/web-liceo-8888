import type { Component } from "svelte";
import z from "zod";


export const SidebarItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.custom<Component>().optional(),
});

export const SidebarSchema = z.array(SidebarItemSchema.extend({
  children: z.array(SidebarItemSchema).optional(),
}));