import { writable } from 'svelte/store';
import type { GetUserProperties, PutUserProperties } from '$lib/models/users/user-properties.type';
import { getUserProperties, updateUserProperties } from '$lib/services/users/users-properties';

export const userPropertiesStore = writable<GetUserProperties | null>(null);
export const userPropertiesLoadingStore = writable<boolean>(false);
export const userPropertiesErrorStore = writable<string | null>(null);

export const userPropertiesActions = {
	getUserProperties: async (userId: string) => {
		try {
			userPropertiesLoadingStore.set(true);
			userPropertiesErrorStore.set(null);
			const userProperties = await getUserProperties(userId);
			userPropertiesStore.set(userProperties);
		} catch (error) {
			userPropertiesErrorStore.set((error as Error).message);
		} finally {
			userPropertiesLoadingStore.set(false);
		}
	},

	updateUserProperties: async (userId: string, data: PutUserProperties) => {
		try {
			userPropertiesLoadingStore.set(true);
			userPropertiesErrorStore.set(null);
			const userProperties = await updateUserProperties(userId, data);
			userPropertiesStore.set(userProperties);
		} catch (error) {
			userPropertiesErrorStore.set((error as Error).message);
		} finally {
			userPropertiesLoadingStore.set(false);
		}
	}
};
