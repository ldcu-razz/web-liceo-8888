import { writable } from 'svelte/store';
import type { LoginPayload, LoginResponse } from '$lib/models/session/session.type';
import { login, logout } from '$lib/services/auth/login.service';
import { toast } from 'svelte-sonner';

export const authStore = writable<LoginResponse | null>(null);
export const logginOutStore = writable<boolean>(false);

export const authActions = {
	login: async (payload: LoginPayload): Promise<LoginResponse> => {
		try {
			const response = await login(payload);

			if (response.success) {
				authStore.set(response);
			}
			return response;
		} catch (error) {
			toast.error('Failed to login');
			console.error(error);
			throw new Error((error as Error).message);
		}
	},

	logout: async () => {
		logginOutStore.set(true);
		try {
			const response = await logout();
			if (response.success) {
				authStore.set(null);
			}
		} catch (error) {
			toast.error('Failed to logout');
			console.error(error);
		} finally {
			logginOutStore.set(false);
		}
	}
};
