import {
	getSystemSettings,
	resetAllUsersTicketLimit,
	updateSystemSettings
} from '$lib/services/system/settings.service';
import { writable } from 'svelte/store';
import type { GetSystemSettings, PutSystemSettings } from '$lib/models/system/system-settings.type';
import { toast } from 'svelte-sonner';

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

	updateSystemSettings: async (id: string, data: PutSystemSettings) => {
		const toastId = toast.loading('Updating system settings...');
		try {
			systemSettingsErrorStore.set(null);
			const systemSettings = await updateSystemSettings(id, data);
			systemSettingsStore.update((prev) => (prev ? { ...prev, ...systemSettings } : prev));
			toast.success('System settings updated successfully', { id: toastId });
		} catch (error) {
			systemSettingsErrorStore.set((error as Error).message);
			toast.error('Failed to update system settings', { id: toastId });
		}
	},

	resetAllUsersTicketLimit: async (number_of_tickets_creation_limit: number) => {
		const toastId = toast.loading('Resetting all users ticket limit...');
		try {
			systemSettingsErrorStore.set(null);
			const systemSettings = await resetAllUsersTicketLimit(number_of_tickets_creation_limit);
			systemSettingsStore.update((prev) => (prev ? { ...prev, ...systemSettings } : prev));
			toast.success('All users ticket limit reset successfully', { id: toastId });
		} catch (error) {
			systemSettingsErrorStore.set((error as Error).message);
			toast.error('Failed to reset all users ticket limit', { id: toastId });
		}
	}
};
