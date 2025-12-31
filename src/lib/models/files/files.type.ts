import type z from "zod";
import type { FilesSchema, FileTypesSchema, GetFileSchema, GetFilesPaginatedSchema, PostFileSchema } from "./files.schema";

export type Files = z.infer<typeof FilesSchema>;

export type FileTypes = z.infer<typeof FileTypesSchema>;

export type PostFile = z.infer<typeof PostFileSchema>;

export type GetFile = z.infer<typeof GetFileSchema>;

export type GetFilesPaginated = z.infer<typeof GetFilesPaginatedSchema>;