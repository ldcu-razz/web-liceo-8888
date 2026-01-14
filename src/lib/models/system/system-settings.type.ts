import type z from 'zod';
import type {
	GetSystemSettingsSchema,
	PutSystemSettingsSchema,
	SystemSettingsSchema
} from './system-settings.schema';

export type SystemSettings = z.infer<typeof SystemSettingsSchema>;
export type GetSystemSettings = z.infer<typeof GetSystemSettingsSchema>;
export type PutSystemSettings = z.infer<typeof PutSystemSettingsSchema>;
