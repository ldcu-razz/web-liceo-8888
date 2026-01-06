import { PaginatedSchema, UUIDSchema } from "../common/common.schema";
import z from "zod";

export const FileTypesSchema = z.enum(["image", "video", "audio", "document", "pdf", "excel", "powerpoint", "word", "other"]);

export const FilesSchema = z.object({
  id: UUIDSchema,
  ownder_id: UUIDSchema,
  path: z.string(),
  type: FileTypesSchema,
  size: z.number(),
  extension: z.string(),
  mime_type: z.string(),
  createdAt: z.string(),
});

export const PostFileSchema = FilesSchema;

export const PutFileSchema = PostFileSchema.partial();

export const GetFileSchema = FilesSchema;

export const GetFilesPaginatedSchema = PaginatedSchema.extend({
  data: z.array(FilesSchema),
});