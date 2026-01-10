import z from 'zod';
import { PaginatedSchema, UUIDSchema } from '../common/common.schema';

export const NotificationsTypesSchema = z.enum([
	'ticket_created',
	'ticket_updated',
	'ticket_commented',
	'ticket_user_assigned',
	'ticket_department_assigned'
]);

export const NotificationTicketCreatedMetadataSchema = z.object({
	ticket_id: UUIDSchema,
	code: z.string(),
	title: z.string(),
	message: z.string(),
	created_by: UUIDSchema
});

export const NotificationTicketUpdatedMetadataSchema = z.object({
	ticket_id: UUIDSchema,
	code: z.string(),
	title: z.string(),
	message: z.string(),
	updated_by: UUIDSchema
});

export const NotificationTicketCommentedMetadataSchema = z.object({
	ticket_id: UUIDSchema,
	code: z.string(),
	title: z.string(),
	message: z.string(),
	commented_by: UUIDSchema
});

export const NotificationTicketUserAssginedMetadataSchema = z.object({
	ticket_id: UUIDSchema,
	code: z.string(),
	title: z.string(),
	message: z.string(),
	assigned_by: UUIDSchema
});

export const NoticationTicketDepartmentAssignedMetadataSchema = z.object({
	ticket_id: UUIDSchema,
	code: z.string(),
	title: z.string(),
	message: z.string(),
	assigned_by: UUIDSchema
});

export const NotificationMetaDataSchema = z.discriminatedUnion('type', [
	NotificationTicketCreatedMetadataSchema,
	NotificationTicketUpdatedMetadataSchema,
	NotificationTicketCommentedMetadataSchema,
	NotificationTicketUserAssginedMetadataSchema,
	NoticationTicketDepartmentAssignedMetadataSchema
]);

export const NotificationsSchema = z.object({
	id: UUIDSchema,
	type: NotificationsTypesSchema,
	metadata: NotificationMetaDataSchema,
	mark_as_read: z.boolean().default(false),
	notify_to: UUIDSchema,
	createdAt: z.string()
});

export const GetNotificationsSchema = NotificationsSchema;

export const PostNotificationPayloadSchema = NotificationsSchema;

export const PostNotificationsSchema = PostNotificationPayloadSchema.array();

export const PutNotificationsSchema = NotificationsSchema.partial();

export const GetNotificationsPaginatedSchema = PaginatedSchema.extend({
	unread_count: z.number(),
	data: z.array(GetNotificationsSchema)
});
