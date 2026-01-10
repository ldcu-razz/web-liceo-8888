import z from 'zod';
import type {
	NotificationsTypesSchema,
	NotificationTicketCommentedMetadataSchema,
	NotificationTicketCreatedMetadataSchema,
	NoticationTicketDepartmentAssignedMetadataSchema,
	NotificationTicketUpdatedMetadataSchema,
	NotificationTicketUserAssginedMetadataSchema,
	NotificationMetaDataSchema,
	NotificationsSchema,
	GetNotificationsSchema,
	PostNotificationsSchema,
	GetNotificationsPaginatedSchema,
	PutNotificationsSchema,
	PostNotificationPayloadSchema
} from './notifications.schema';

export type NotificationsTypes = z.infer<typeof NotificationsTypesSchema>;
export type NotificationTicketCreatedMetadata = z.infer<
	typeof NotificationTicketCreatedMetadataSchema
>;
export type NotificationTicketUpdatedMetadata = z.infer<
	typeof NotificationTicketUpdatedMetadataSchema
>;
export type NotificationTicketCommentedMetadata = z.infer<
	typeof NotificationTicketCommentedMetadataSchema
>;
export type NotificationTicketDepartmentAssignedMetadata = z.infer<
	typeof NoticationTicketDepartmentAssignedMetadataSchema
>;
export type NotificationTicketUserAssignedMetadata = z.infer<
	typeof NotificationTicketUserAssginedMetadataSchema
>;
export type NotificationMetaData = z.infer<typeof NotificationMetaDataSchema>;
export type Notifications = z.infer<typeof NotificationsSchema>;
export type GetNotifications = z.infer<typeof GetNotificationsSchema>;
export type PostNotificationPayload = z.infer<typeof PostNotificationPayloadSchema>;
export type PostNotifications = z.infer<typeof PostNotificationsSchema>;
export type PutNotifications = z.infer<typeof PutNotificationsSchema>;
export type GetNotificationsPaginated = z.infer<typeof GetNotificationsPaginatedSchema>;
