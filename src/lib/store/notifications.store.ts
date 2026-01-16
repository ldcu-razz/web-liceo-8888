import { get, writable } from 'svelte/store';
import type {
	GetNotifications,
	PostNotifications,
	PutNotifications
} from '$lib/models/notifications/notifications.type';
import type { Pagination } from '$lib/models/common/common.type';
import { adminAndSuperAdminUsers, allUsersMap, usersBasedOnDepartmentStore } from './users.store';
import {
	createNotification,
	getCreateTicketNotificationPayload,
	getNotifications,
	getTicketNotificationCommentMentionedUserPayload,
	getTicketNotificationDepartmentAssignedPayload,
	getTicketNotificationReportedUserPayload,
	getUpdateStatusTicketNotificationPayload,
	getUserAssignedTicketNotificationPayload,
	updateNotification
} from '$lib/services/notifications/notifications.service';
import type { GetTicket } from '$lib/models/tickets/tickets.type';
import { meStore } from './me.store';
import type { GetUser } from '$lib/models/users/users.type';
import type { GetTicketComment } from '$lib/models/tickets/ticket-comments.type';
import type { Departments } from '$lib/models/departments/departments.type';

export const notificationsStore = writable<GetNotifications[]>([]);
export const notificationsLoadingStore = writable<boolean>(false);
export const notificationsCountStore = writable<number>(0);
export const notificationsUnreadCountStore = writable<number>(0);
export const notificationsPaginationStore = writable<Pagination>({ page: 1, size: 15 });

export const notificationsActions = {
	getNotifications: async (pagination: Pagination, notifyToId: string, silentLoading?: boolean) => {
		if (!silentLoading) {
			notificationsLoadingStore.set(true);
		}
		try {
			const data = await getNotifications(pagination, notifyToId);
			notificationsStore.set(data.data);
			notificationsCountStore.set(data.count);
			notificationsPaginationStore.update((prev) => ({
				...prev,
				page: pagination.page,
				size: pagination.size
			}));
			notificationsUnreadCountStore.set(data.unread_count);
		} catch (error) {
			console.error(error);
		} finally {
			notificationsLoadingStore.set(false);
		}
	},

	postNotification: async (notification: PostNotifications) => {
		try {
			const data = await createNotification(notification);
			notificationsStore.set([data, ...get(notificationsStore)]);
		} catch (error) {
			console.error(error);
		}
	},

	updateNotification: async (notification: PutNotifications) => {
		try {
			const data = await updateNotification(notification);
			notificationsStore.set(get(notificationsStore).map((n) => (n.id === data.id ? data : n)));
		} catch (error) {
			console.error(error);
		}
	},

	insertNotification: (notification: GetNotifications) =>
		notificationsStore.update((prev) => [notification, ...prev]),

	updateUnreadNotificationsCount: (additionalUnreadCount: number) =>
		notificationsUnreadCountStore.set(get(notificationsUnreadCountStore) + additionalUnreadCount),

	markAsRead: async (notificationId: string) => {
		try {
			const data = await updateNotification({
				id: notificationId,
				mark_as_read: true
			} as PutNotifications);
			notificationsStore.set(get(notificationsStore).map((n) => (n.id === data.id ? data : n)));
			notificationsUnreadCountStore.set(get(notificationsUnreadCountStore) - 1);
		} catch (error) {
			console.error(error);
		}
	},

	createTicketCreatedNotification: async (ticket: GetTicket) => {
		try {
			const adminAndSuperAdminUsersData = get(adminAndSuperAdminUsers);
			const meStoreData = get(meStore) as GetUser;
			const payload: PostNotifications = adminAndSuperAdminUsersData
				.filter((user) => meStoreData && user.id !== meStoreData?.id)
				.map((user) => {
					return getCreateTicketNotificationPayload(ticket, meStoreData, user.id);
				});
			await createNotification(payload);
		} catch (error) {
			console.error(error);
		}
	},

	createTicketStatusChangedNotification: async (ticket: GetTicket) => {
		try {
			const usersAdminAndSuperAdmin = get(adminAndSuperAdminUsers);
			const userReportedBy = get(allUsersMap)[ticket.reported_by.id];
			const usersBasedOnDepartment = ticket.current_department_assigned?.id
				? get(usersBasedOnDepartmentStore(ticket.current_department_assigned.id))
				: [];
			const meStoreData = get(meStore) as GetUser;
			const allUsers = Array.from(
				new Map(
					[...usersAdminAndSuperAdmin, ...[userReportedBy], ...usersBasedOnDepartment].map(
						(user) => [user.id, user]
					)
				).values()
			);
			const usersToNotify = allUsers.filter((user) => meStoreData && user.id !== meStoreData?.id);
			const payload: PostNotifications = usersToNotify
				.filter((user) => meStoreData && user.id !== meStoreData?.id)
				.map((user) => {
					return getUpdateStatusTicketNotificationPayload(ticket, meStoreData, user.id);
				});
			await createNotification(payload);
		} catch (error) {
			console.error(error);
		}
	},

	createUserAssignedTicketNotification: async (ticket: GetTicket) => {
		try {
			const assignedUserId = ticket.current_user_assigned.id;
			const reportedByUserId = ticket.reported_by.id;
			const assignedTo = get(allUsersMap)[assignedUserId];
			const meStoreData = get(meStore);

			if (!meStoreData) {
				return;
			}

			if (meStoreData.id !== assignedUserId) {
				const payload: PostNotifications = [
					getUserAssignedTicketNotificationPayload(ticket, meStoreData, assignedTo, assignedUserId)
				];
				await createNotification(payload);
			}

			// For Reported User
			if (reportedByUserId !== assignedUserId) {
				const reportedUser = get(allUsersMap)[ticket.reported_by.id];
				const reportedUserPayload: PostNotifications = [
					getUserAssignedTicketNotificationPayload(
						ticket,
						meStoreData,
						reportedUser,
						reportedByUserId
					)
				];
				await createNotification(reportedUserPayload);
			}
		} catch (error) {
			console.error(error);
		}
	},

	createTicketCommentedNotification: async (ticket: GetTicket, comment: GetTicketComment) => {
		try {
			const meStoreData = get(meStore) as GetUser;

			// For Mentioned Users
			const mentionedUsers = comment.mentioned_users;
			if (mentionedUsers.length > 0) {
				const mentionedUserpayload: PostNotifications = mentionedUsers.map((user) => {
					return getTicketNotificationCommentMentionedUserPayload(
						ticket,
						comment,
						meStoreData,
						user.id
					);
				});
				await createNotification(mentionedUserpayload);
			}

			// For Reported User
			if (comment.is_visible_to_public) {
				const reportedUser = get(allUsersMap)[ticket.reported_by.id];
				const reportedUserPayload: PostNotifications = [
					getTicketNotificationReportedUserPayload(ticket, comment, meStoreData, reportedUser.id)
				];
				await createNotification(reportedUserPayload);
			}
		} catch (error) {
			console.error(error);
		}
	},

	createTicketDepartmentAssignedNotification: async (
		ticket: GetTicket,
		department: Departments
	) => {
		try {
			const meStoreData = get(meStore) as GetUser;
			const usersInDepartment = get(usersBasedOnDepartmentStore(department.id));
			const payload: PostNotifications = usersInDepartment.map((user) => {
				return getTicketNotificationDepartmentAssignedPayload(
					ticket,
					department,
					meStoreData,
					user.id
				);
			});
			await createNotification(payload);
		} catch (error) {
			console.error(error);
		}
	},

	reset: async () => {
		notificationsStore.set([]);
		notificationsLoadingStore.set(false);
		notificationsCountStore.set(0);
		notificationsUnreadCountStore.set(0);
		notificationsPaginationStore.set({ page: 1, size: 15 });
	}
};
