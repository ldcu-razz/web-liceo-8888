import { API_NOTIFICATIONS } from '$lib/constants/routes.constants';
import type { Pagination } from '$lib/models/common/common.type';
import type { Departments } from '$lib/models/departments/departments.type';
import { NotificationsTypesSchema } from '$lib/models/notifications/notifications.schema';
import type {
	GetNotifications,
	GetNotificationsPaginated,
	PostNotificationPayload,
	PostNotifications,
	PutNotifications
} from '$lib/models/notifications/notifications.type';
import type { GetTicketComment } from '$lib/models/tickets/ticket-comments.type';
import type { GetTicket } from '$lib/models/tickets/tickets.type';
import type { GetUser, Users } from '$lib/models/users/users.type';
import { notificationsActions } from '$lib/store/notifications.store';
import { supabase } from '$lib/supabase/client';
import { transformText } from '$lib/utils/texts.utils';
import { uuid } from '$lib/utils/uuid.util';
import { toast } from 'svelte-sonner';
import { requestFetch } from '../request/request.service';
import notificationSound1 from '$lib/assets/sounds/notification-sound-1.mp3';

export async function getNotifications(
	pagination?: Pagination,
	notifyToId?: string
): Promise<GetNotificationsPaginated> {
	try {
		const url = new URL(API_NOTIFICATIONS, window.location.origin);
		if (pagination) {
			url.searchParams.set('page', pagination.page.toString());
			url.searchParams.set('size', pagination.size.toString());
		}

		if (notifyToId) {
			url.searchParams.set('notify_to', notifyToId);
		}
		const result = await requestFetch(url.toString());
		if (!result.ok) {
			throw new Error(result.statusText);
		}
		return result.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}

export async function createNotification(
	notification: PostNotifications
): Promise<GetNotifications> {
	try {
		const result = await requestFetch(API_NOTIFICATIONS, {
			method: 'POST',
			body: JSON.stringify(notification)
		});
		if (!result.ok) {
			throw new Error(result.statusText);
		}
		return result.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}

export async function updateNotification(
	notification: PutNotifications
): Promise<GetNotifications> {
	try {
		const result = await requestFetch(API_NOTIFICATIONS, {
			method: 'PUT',
			body: JSON.stringify(notification)
		});
		if (!result.ok) {
			throw new Error(result.statusText);
		}
		return result.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}

export function getNotificationChannel(
	notifyToId: string
): Awaited<ReturnType<typeof supabase.channel>> {
	const channel = supabase.channel(`notifications:${notifyToId}`);
	channel.on(
		'postgres_changes',
		{
			event: 'INSERT',
			schema: 'public',
			table: 'notifications',
			filter: `notify_to=eq.${notifyToId}`
		},
		(payload) => {
			const notification = payload.new as GetNotifications;

			// Don't show notification if the current user triggered the action
			const metadata = notification.metadata as Record<string, string | undefined>;
			const actionCreatorId =
				metadata?.created_by ||
				metadata?.updated_by ||
				metadata?.assigned_by ||
				metadata?.commented_by;

			if (actionCreatorId && actionCreatorId === notifyToId) {
				console.log('Skipping self-notification');
				return;
			}

			if (payload.eventType === 'INSERT') {
				notificationsActions.insertNotification(notification);
				notificationsActions.updateUnreadNotificationsCount(1);
				toast.success('You have a new notification', { duration: 10_000 });

				const notificationSound = new Audio(notificationSound1);
				notificationSound.volume = 0.5;
				notificationSound.play().catch((error) => {
					console.log('Notification sound blocked by browser:', error);
				});
				notificationSound.onended = () => {
					notificationSound.currentTime = 0;
				};
			}
		}
	);
	return channel;
}

// Inline conditions will be used when constructing payloads to keep logic explicit.

export function getCreateTicketNotificationPayload(
	ticket: GetTicket,
	createdBy: GetUser,
	notifyToUserId: string
): PostNotificationPayload {
	const isAnonymous = ticket?.anon === true;

	const createdByFullName = isAnonymous
		? 'Anonymous User'
		: `${createdBy.firstname} ${createdBy.lastname}`;

	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_created,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: `<span style="font-weight: 600;">${createdByFullName}</span> created a new ticket`,
			message: ticket.description,
			
			created_by: isAnonymous ? '' : createdBy.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
}

export function getUpdateStatusTicketNotificationPayload(
	ticket: GetTicket,
	updatedBy: GetUser,
	notifyToUserId: string
): PostNotificationPayload {
	const updatedByFullName = ticket?.anon
		? 'Anonymous User'
		: `${updatedBy.firstname} ${updatedBy.lastname}`;
	const ticketStatusName = transformText(ticket.status);
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_updated,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: `Status Changed`,
			message: `<span style="font-weight: 600;">${updatedByFullName}</span> changed the status to <span style="font-weight: 600;">${ticketStatusName}</span>`,
			updated_by: updatedBy.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
}

export function getUserAssignedTicketNotificationPayload(
	ticket: GetTicket,
	assignedBy: Users,
	assignedTo: Users,
	notifyToUserId: string
): PostNotificationPayload {
	const assignedByFullName = ticket?.anon
		? 'Anonymous User'
		: `${assignedBy.firstname} ${assignedBy.lastname}`;
	const assignedToFullName = ticket?.anon
		? 'Anonymous User'
		: `${assignedTo.firstname} ${assignedTo.lastname}`;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_user_assigned,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: 'Ticket Assigned',
			message: `<span style="font-weight: 600;">${assignedByFullName}</span> assigned the ticket to <span style="font-weight: 600;">${assignedToFullName}</span>`,
			assigned_by: assignedBy.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
}

export const getTicketNotificationReportedUserPayload = (
	ticket: GetTicket,
	comment: GetTicketComment,
	createdByUser: GetUser,
	notifyToUserId: string
): PostNotificationPayload => {
	const createdByUserFullName = ticket?.anon
		? 'Anonymous User'
		: `${createdByUser.firstname} ${createdByUser.lastname}`;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_commented,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: `<span style="font-weight: 600;">${createdByUserFullName}</span> commented on your ticket`,
			message: comment.comment,
			commented_by: createdByUser.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
};

export const getTicketNotificationCommentMentionedUserPayload = (
	ticket: GetTicket,
	comment: GetTicketComment,
	createdByUser: GetUser,
	notifyToUserId: string
): PostNotificationPayload => {
	const createdByUserFullName = ticket?.anon
		? 'Anonymous User'
		: `${createdByUser.firstname} ${createdByUser.lastname}`;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_commented,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: `<span style="font-weight: 600;">${createdByUserFullName}</span> mentioned you in a comment`,
			message: comment.comment,
			commented_by: createdByUser.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
};

export const getTicketNotificationDepartmentAssignedPayload = (
	ticket: GetTicket,
	department: Departments,
	assignedBy: GetUser,
	notifyToUserId: string
): PostNotificationPayload => {
	const departmentName = `${department.name}`;
	const assignedByFullName = ticket?.anon
		? 'Anonymous User'
		: `${assignedBy.firstname} ${assignedBy.lastname}`;
	const assignedById = assignedBy.id;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_department_assigned,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: 'Ticket Assigned To Department',
			message: `<span><span style="font-weight: 600;">${assignedByFullName}</span> assigned the ticket to the department <span style="font-weight: 600;">${departmentName}</span></span>`,
			assigned_by: assignedById
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
};

// Users Creation Notifications
export const getAccountCreatedNotificationPayload = (
	user: Users,
	notifyToUserId: string
): PostNotificationPayload => {
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.account_created,
		metadata: {
			user_id: user.id,
			fullname: `${user.firstname} ${user.lastname}`,
			title: `New Account Created`,
			message: `<span style="font-weight: 600;">${user.firstname} ${user.lastname}</span> created a new account. The account needs to be approved before it can be used.`,
			created_by: user.id
		},
		mark_as_read: false,
		notify_to: notifyToUserId,
		createdAt: new Date().toISOString()
	};
};
