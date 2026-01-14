import type z from 'zod';
import type {
	GetUserPropertiesSchema,
	PostUserPropertiesSchema,
	PutUserPropertiesSchema,
	UserPropertiesSchema
} from './user-properties.schema';

export type UserProperties = z.infer<typeof UserPropertiesSchema>;
export type GetUserProperties = z.infer<typeof GetUserPropertiesSchema>;
export type PostUserProperties = z.infer<typeof PostUserPropertiesSchema>;
export type PutUserProperties = z.infer<typeof PutUserPropertiesSchema>;