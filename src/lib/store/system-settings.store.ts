import { getSystemSettings, updateSystemSettings } from '$lib/services/system/settings.service';
import { writable } from 'svelte/store';
import type { GetSystemSettings, PutSystemSettings } from '$lib/models/system/system-settings.type';

export const systemSettingsStore = writable<GetSystemSettings | null>(null);
export const systemSettingsLoadingStore = writable<boolean>(false);
export const systemSettingsErrorStore = writable<string | null>(null);

export const systemSettingsActions = {
	getSystemSettings: async () => {
		try {
			systemSettingsLoadingStore.set(true);
			systemSettingsErrorStore.set(null);
			const systemSettings = await getSystemSettings();
			systemSettingsStore.set(systemSettings);
		} catch (error) {
			systemSettingsErrorStore.set((error as Error).message);
		} finally {
			systemSettingsLoadingStore.set(false);
		}
	},

	updateSystemSettings: async (data: PutSystemSettings) => {
		try {
			systemSettingsLoadingStore.set(true);
			systemSettingsErrorStore.set(null);
			const systemSettings = await updateSystemSettings(data);
			systemSettingsStore.set(systemSettings);
		} catch (error) {
			systemSettingsErrorStore.set((error as Error).message);
		} finally {
			systemSettingsLoadingStore.set(false);
		}
	}
};
