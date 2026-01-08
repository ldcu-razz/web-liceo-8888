import type { Users } from '$lib/models/users/users.type';
import {
	changePassword,
	changeUsername,
	getMe,
	updateUser
} from '$lib/services/users/users.service';
import { get, writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import type { Session } from '$lib/models/session/session.type';
import type { Pagination } from '$lib/models/common/common.type';
import { getPaginatedSessions } from '$lib/services/auth/session.service';
import { filesActions } from './files.store';

export const meStore = writable<Users | null>(null);

export const meSessionsStore = writable<Session[]>([]);
export const meSessionsPagination = writable<Pagination>({ page: 1, size: 10 });
export const meSessionsTotalCount = writable<number>(0);
export const meSessionsLoading = writable<boolean>(false);
export const meSessionsError = writable<string | null>(null);

export const meActions = {
	getMe: async () => {
		try {
			const user = await getMe();
			meStore.set(user);
			return user;
		} catch (error) {
			toast.error('Failed to get current user');
			console.error(error);
			throw new Error((error as Error).message);
		}
	},

	setMe: (user: Users) => {
		meStore.set(user);
	},

	uploadAvatar: async (file: File) => {
		const toastId = toast.loading('Uploading avatar...');
		try {
			const response = await filesActions.uploadFile({
				file,
				user_id: get(meStore)?.id ?? '',
				ticket_id: null
			});
			meStore.update((prev) => (prev ? { ...prev, avatar: response.path } : prev));
			await updateUser(get(meStore)?.id ?? '', { avatar: response.path });
			toast.success('Avatar uploaded successfully', { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error('Failed to upload avatar', { id: toastId });
			throw new Error((error as Error).message);
		}
	},

	removeAvatar: async () => {
		const toastId = toast.loading('Removing avatar...');
		try {
			await updateUser(get(meStore)?.id ?? '', { avatar: '' });
			meStore.update((prev) => (prev ? { ...prev, avatar: '' } : prev));
			toast.success('Avatar removed successfully', { id: toastId });
		} catch (error) {
			console.error(error);
			toast.error('Failed to remove avatar', { id: toastId });
		}
	},

	changePassword: async (currentPassword: string, newPassword: string, userId: string) => {
		const toastId = toast.loading('Changing password...');
		try {
			const response = await changePassword(currentPassword, newPassword, userId);
			toast.success('Password changed successfully', { id: toastId });
			return response;
		} catch (error) {
			toast.error('Failed to change password');
			console.error(error);
			throw new Error((error as Error).message);
		}
	},

	changeUsername: async (username: string, userId: string) => {
		const toastId = toast.loading('Changing username...');
		try {
			const response = await changeUsername(username, userId);
			meStore.update((prev) => (prev ? { ...prev, username } : prev));
			toast.success('Username changed successfully', { id: toastId });
			return response;
		} catch (error) {
			console.error(error);
			meStore.update((prev) => (prev ? { ...prev, username: prev.username } : prev));
			toast.error('Failed to change username');
			throw new Error((error as Error).message);
		} finally {
			toast.dismiss(toastId);
		}
	},

	getSessions: async (pagination: Pagination, silentLoading?: boolean) => {
		try {
			if (!silentLoading) {
				meSessionsLoading.set(true);
			}
			const data = await getPaginatedSessions(pagination);
			meSessionsStore.set(data.data);
			meSessionsPagination.update((prev) => ({
				...prev,
				page: pagination.page,
				size: pagination.size
			}));
			meSessionsTotalCount.update(() => data.count);
		} catch (error) {
			console.error(error);
			meSessionsError.set((error as Error).message);
		} finally {
			meSessionsLoading.set(false);
		}
	}
};
