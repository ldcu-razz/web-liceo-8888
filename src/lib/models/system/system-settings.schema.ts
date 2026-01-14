import z from 'zod';

export const SystemSettingsSchema = z.object({
	id: z.string(),
	number_of_tickets_creation_limit: z.number(),
	number_of_users_creation_limit: z.number(),
	is_maintenance_mode: z.boolean().default(false),
});

export const GetSystemSettingsSchema = SystemSettingsSchema;

export const PutSystemSettingsSchema = SystemSettingsSchema.omit({ id: true }).partial();
