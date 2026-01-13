import z from 'zod';
import { UUIDSchema } from '../common/common.schema';

export const UserPropertiesSchema = z.object({
	id: z.string(),
	user_id: UUIDSchema,
	remaining_tickets_creation: z.number(),
	bypass_ticket_creation_limit: z.boolean().default(false)
});

export const GetUserPropertiesSchema = UserPropertiesSchema;

export const PutUserPropertiesSchema = UserPropertiesSchema.omit({
	id: true,
	user_id: true
}).partial();
