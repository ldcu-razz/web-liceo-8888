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
import type { GetUser } from '$lib/models/users/users.type';
import { transformText } from '$lib/utils/texts.utils';
import { uuid } from '$lib/utils/uuid.util';

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
		const result = await fetch(url.toString());
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
		const result = await fetch(API_NOTIFICATIONS, {
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
		const result = await fetch(API_NOTIFICATIONS, {
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

export function getCreateTicketNotificationPayload(
	ticket: GetTicket,
	createdBy: GetUser,
	notifyToUserId: string
): PostNotificationPayload {
	const createdByFullName = `${createdBy.firstname} ${createdBy.lastname}`;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_created,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: `<span style="font-weight: 600;">${createdByFullName}</span> created a new ticket`,
			message: ticket.description,
			created_by: createdBy.id
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
	const updatedByFullName = `${updatedBy.firstname} ${updatedBy.lastname}`;
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
	assignedBy: GetUser,
	notifyToUserId: string
): PostNotificationPayload {
	const assignedByFullName = `${assignedBy.firstname} ${assignedBy.lastname}`;
	return {
		id: uuid(),
		type: NotificationsTypesSchema.enum.ticket_user_assigned,
		metadata: {
			ticket_id: ticket.id,
			code: ticket.code,
			title: 'Ticket Assigned',
			message: `<span style="font-weight: 600;">${assignedByFullName}</span> assigned the ticket to you`,
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
	const createdByUserFullName = `${createdByUser.firstname} ${createdByUser.lastname}`;
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
	const createdByUserFullName = `${createdByUser.firstname} ${createdByUser.lastname}`;
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
	const assignedByFullName = `${assignedBy.firstname} ${assignedBy.lastname}`;
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
