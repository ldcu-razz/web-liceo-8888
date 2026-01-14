import { derived, get, writable } from 'svelte/store';
import type {
	GetUserByUsernameResponse,
	PostUsers,
	PutUsers,
	TotalUsers,
	Users
} from '$lib/models/users/users.type';
import type { BaseStatusEnum, Pagination } from '$lib/models/common/common.type';
import {
	archiveUser,
	checkUsername,
	createAccount,
	createUser,
	deleteUser,
	getTotalUsers,
	getUser,
	getUsers,
	updateUser
} from '$lib/services/users/users.service';
import { toast } from 'svelte-sonner';
import { BaseStatusEnumSchema } from '$lib/models/common/common.schema';
import { UserRolesEnumSchema } from '$lib/models/users/users.schema';
import type { PostUserProperties, PutUserProperties } from '$lib/models/users/user-properties.type';
import { createUserProperties, updateUserProperties } from '$lib/services/users/users-properties';

export const usersStore = writable<Users[]>([]);
export const usersLoading = writable<boolean>(false);
export const usersPagination = writable<Pagination>({ page: 1, size: 15 });
export const usersTotalCount = writable<number>(0);
export const usersError = writable<string | null>(null);
export const hasUsersData = derived(usersStore, ($usersStore) => $usersStore.length > 0);

export const allUsersStore = writable<Users[]>([]);
export const allUsersMap = derived(allUsersStore, ($allUsersStore) =>
	$allUsersStore.reduce(
		(acc, user) => {
			acc[user.id] = user;
			return acc;
		},
		{} as Record<string, Users>
	)
);

export const adminAndSuperAdminUsers = derived(allUsersStore, ($allUsersStore) => {
	return $allUsersStore.filter(
		(u) =>
			u.role === UserRolesEnumSchema.enum.admin || u.role === UserRolesEnumSchema.enum.super_admin
	);
});

export const usersBasedOnDepartmentStore = (departmentId?: string) =>
	derived(allUsersStore, ($allUsersStore) => {
		return $allUsersStore.filter((u) =>
			u.status === BaseStatusEnumSchema.enum.active && departmentId
				? u.department_id === departmentId
				: true
		);
	});

export const nonMemberUsersStore = writable<Users[]>([]);

export const currentSelectedUserId = writable<string | null>(null);
export const currentSelectedUser = writable<Users | null>(null);
export const currentSelectedUserLoading = writable<boolean>(false);

export const usersActions = {
	setCurrentSelectedUserId: (id: string) => {
		currentSelectedUserId.set(id);
	},

	resetCurrentSelectedUserId: () => {
		currentSelectedUserId.set(null);
	},

	getAllUsers: async () => {
		try {
			if (get(allUsersStore).length > 0) {
				return;
			}

			const data = await getUsers();
			allUsersStore.set(data.data);

			const nonMemberUsers = data.data.filter(
				(u) =>
					u.role === UserRolesEnumSchema.enum.admin ||
					u.role === UserRolesEnumSchema.enum.super_admin ||
					u.role === UserRolesEnumSchema.enum.department_staff
			);
			nonMemberUsersStore.set(nonMemberUsers);
		} catch (error) {
			console.error(error);
			usersError.set((error as Error).message);
		}
	},

	getUsers: async (pagination: Pagination, q?: string, silentLoading?: boolean) => {
		try {
			if (!silentLoading) {
				usersLoading.set(true);
			}

			usersPagination.set(pagination);

			const data = await getUsers(pagination, q);
			usersLoading.set(false);
			usersStore.set(data.data);
			usersPagination.update((prev) => ({ ...prev, page: pagination.page, size: pagination.size }));
			usersTotalCount.update(() => data.count);
		} catch (error) {
			console.error(error);
			usersError.set((error as Error).message);
			usersLoading.set(false);
		}
	},

	getUser: async (id: string) => {
		currentSelectedUserLoading.set(true);
		try {
			const data = await getUser(id);
			currentSelectedUser.set(data);
			usersStore.update((prev) => prev.map((u) => (u.id === data.id ? data : u)));
			return data;
		} catch (error) {
			console.error(error);
			throw new Error((error as Error).message);
		} finally {
			currentSelectedUserLoading.set(false);
		}
	},

	getNonMemberUsers: async () => {
		try {
			const data = get(allUsersStore).filter(
				(u) =>
					u.role === UserRolesEnumSchema.enum.admin ||
					u.role === UserRolesEnumSchema.enum.super_admin ||
					u.role === UserRolesEnumSchema.enum.department_staff
			);

			nonMemberUsersStore.set(data);
		} catch (error) {
			console.error(error);
			usersError.set((error as Error).message);
		}
	},

	createUser: async (user: PostUsers, disabledToast?: boolean) => {
		let toastId: string | number | undefined = undefined;
		if (!disabledToast) {
			toastId = toast.loading(`Creating user...`);
		}
		try {
			usersStore.set([user, ...(get(usersStore) || [])]);
			await createUser(user);
			usersLoading.set(false);
			if (!disabledToast) {
				toast.success(`User created successfully`, { id: toastId });
			}
		} catch (error) {
			console.error(error);
			usersStore.set(get(usersStore).filter((u) => u.id !== user.id));
			toast.error(`Failed to create user`, { id: toastId });
		}
	},

	updateUser: async (id: string, user: PutUsers) => {
		const toastId = toast.loading(`Updating user...`);
		const currentUser = get(usersStore).find((u) => u.id === id);
		try {
			usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...u, ...user } : u)));
			currentSelectedUser.update((prev) => (prev ? { ...prev, ...user } : prev));
			await updateUser(id, user);
			toast.success(`User updated successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			if (currentUser) {
				usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...currentUser } : u)));
				currentSelectedUser.update((prev) => (prev ? { ...prev, ...currentUser } : prev));
			}
			toast.error(`Failed to update user`, { id: toastId });
		}
	},

	deleteUser: async (id: string) => {
		const toastId = toast.loading(`Deleting user...`);
		const currentUser = get(usersStore).find((u) => u.id === id);
		try {
			usersStore.set(get(usersStore).filter((u) => u.id !== id));
			await deleteUser(id);
			toast.success(`User deleted successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			if (currentUser) {
				usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...currentUser } : u)));
			}
			toast.error(`Failed to delete user`, { id: toastId });
		}
	},

	archiveUser: async (id: string) => {
		const toastId = toast.loading(`Archiving user...`);
		const currentUser = get(usersStore).find((u) => u.id === id);
		try {
			usersStore.set(
				get(usersStore).map((u) =>
					u.id === id
						? {
								...u,
								status: BaseStatusEnumSchema.enum.archived,
								updatedAt: new Date().toISOString()
							}
						: u
				)
			);
			await archiveUser(id);
			toast.success(`User archived successfully`, { id: toastId });
		} catch (error) {
			console.error(error);

			if (currentUser) {
				usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...currentUser } : u)));
			}
			toast.error(`Failed to archive user`, { id: toastId });
		}
	},

	updateUserStatus: async (id: string, status: BaseStatusEnum) => {
		const toastId = toast.loading(`Updating user status...`);
		const currentUser = get(usersStore).find((u) => u.id === id);
		try {
			usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...u, status } : u)));
			currentSelectedUser.update((prev) => (prev ? { ...prev, status } : prev));
			await updateUser(id, { status });
			toast.success(`User status updated successfully`, { id: toastId });
		} catch (error) {
			console.error(error);

			if (currentUser) {
				usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...currentUser } : u)));
				currentSelectedUser.update((prev) =>
					prev ? { ...prev, status: currentUser.status } : prev
				);
			}
			toast.error(`Failed to update user status`, { id: toastId });
		}
	},

	updatePassword: async (id: string, password: string) => {
		const toastId = toast.loading(`Updating password...`);
		const currentUser = get(usersStore).find((u) => u.id === id);
		try {
			await updateUser(id, { password });
			toast.success(`Password updated successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			if (currentUser) {
				usersStore.set(get(usersStore).map((u) => (u.id === id ? { ...currentUser } : u)));
				currentSelectedUser.update((prev) =>
					prev ? { ...prev, password: currentUser.password } : prev
				);
			}
			toast.error(`Failed to update password`, { id: toastId });
		}
	},

	checkUsername: async (username: string): Promise<GetUserByUsernameResponse> => {
		try {
			const response = await checkUsername(username);
			return response;
		} catch (error) {
			console.error(error);
			throw new Error((error as Error).message);
		}
	},

	createAccount: async (user: PostUsers) => {
		try {
			const response = await createAccount(user);
			return response;
		} catch (error) {
			console.error(error);
			throw new Error((error as Error).message);
		}
	},

	createUserProperties: async (userId: string, payload: PostUserProperties) => {
		const toastId = toast.loading(`Creating user properties...`);
		try {
			usersStore.update((prev) => prev.map((u) => (u.id === userId ? { ...u, properties: [...(u.properties || []), payload] } : u)));
			const response = await createUserProperties(userId, payload);
			currentSelectedUser.update((prev) => (prev ? { ...prev, properties: [...(prev.properties || []), response] } : prev));
			toast.success(`User properties created successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			usersStore.update((prev) => prev.map((u) => (u.id === userId ? { ...u, properties: [...(u.properties || []), payload] } : u)));
			toast.error(`Failed to create user properties`, { id: toastId });
			throw new Error((error as Error).message);
		}
	},

	updateUserProperties: async (userId: string, userPropertiesId: string, payload: PutUserProperties, silentToast?: boolean) => {
		let toastId: string | number | undefined = undefined;
		if (!silentToast) {
			toastId = toast.loading(`Updating user properties...`);
		}
		try {
			usersStore.update((prev) => prev.map((u) => (u.id === userId ? { ...u, properties: u.properties?.map((p) => (p.id === userPropertiesId ? { ...p, ...payload } : p)) } : u)));
			const response = await updateUserProperties(userId, userPropertiesId, payload);
			currentSelectedUser.update((prev) => (prev ? { ...prev, properties: [...(prev.properties || []), response] } : prev));
			if (!silentToast) {
				toast.success(`User properties updated successfully`, { id: toastId });
			}
		} catch (error) {
			console.error(error);
			usersStore.update((prev) => prev.map((u) => (u.id === userId ? { ...u, properties: u.properties?.map((p) => (p.id === userPropertiesId ? { ...p } : p)) } : u)));
			if (!silentToast) {	
				toast.error(`Failed to update user properties`, { id: toastId });
			}
			throw new Error((error as Error).message);
		}
	},

	getTotalUsers: async (): Promise<TotalUsers> => {
		try {
			const response = await getTotalUsers();
			return response;
		} catch (error) {
			console.error(error);
			throw new Error((error as Error).message);
		}
	},
};
