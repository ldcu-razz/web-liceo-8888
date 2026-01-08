import { PaginatedSchema, UUIDSchema } from '../common/common.schema';
import z from 'zod';

export const FileTypesSchema = z.enum([
	'image',
	'video',
	'audio',
	'document',
	'pdf',
	'excel',
	'powerpoint',
	'word',
	'other'
]);

export const FilesSchema = z.object({
	id: UUIDSchema,
	path: z.string(),
	type: FileTypesSchema,
	size: z.number(),
	extension: z.string(),
	mime_type: z.string(),
	createdAt: z.string(),
	user_id: UUIDSchema.optional().nullable().default(null),
	ticket_id: UUIDSchema.optional().nullable().default(null),
	department_id: UUIDSchema.optional().nullable().default(null)
});

export const PostFileSchema = FilesSchema.pick({
	user_id: true,
	ticket_id: true,
	department_id: true
})
	.partial()
	.extend({
		file: z.instanceof(File)
	});

export const PostFilePropertiesSchema = FilesSchema;

export const PutFileSchema = PostFileSchema.partial();

export const GetFileSchema = FilesSchema;

export const GetFilesPaginatedSchema = PaginatedSchema.extend({
	data: z.array(FilesSchema)
});
