import z from 'zod';
import { UUIDSchema } from '../common/common.schema';

export const UserPropertiesSchema = z.object({
	id: z.string(),
	user_id: UUIDSchema,
	remaining_tickets_creation: z.number(),
	bypass_ticket_creation_limit: z.boolean().default(false),
	vertification_token: z.string().nullable().default(null),
	verified_at: z.string().nullable().default(null),
});

export const PostUserPropertiesSchema = UserPropertiesSchema;

export const GetUserPropertiesSchema = UserPropertiesSchema;

export const PutUserPropertiesSchema = UserPropertiesSchema.omit({
	id: true,
	user_id: true
}).partial();
