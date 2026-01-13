import { API_SYSTEM_SETTINGS } from '$lib/constants/routes.constants';
import { getRoute } from '$lib/utils/routes.utils';
import { requestFetch } from '../request/request.service';
import type { PutSystemSettings } from '$lib/models/system/system-settings.type';

export async function getSystemSettings() {
	try {
		const url = getRoute(API_SYSTEM_SETTINGS, {});
		const request = await requestFetch(url);
		if (!request.ok) {
			const result = await request.json();
			throw new Error(result.error);
		}
		return request.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}

export async function updateSystemSettings(data: PutSystemSettings) {
	try {
		const url = getRoute(API_SYSTEM_SETTINGS, {});
		const request = await requestFetch(url, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
		if (!request.ok) {
			const result = await request.json();
			throw new Error(result.error);
		}
		return request.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}
