import { API_SYSTEM_SETTINGS, API_USERS_PROPERTIES_RESET } from '$lib/constants/routes.constants';
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

export async function updateSystemSettings(id: string, data: PutSystemSettings) {
	try {
		const url = new URL(getRoute(API_SYSTEM_SETTINGS, {}), window.location.origin);
		url.searchParams.set('id', id);
		const request = await requestFetch(url.toString(), {
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

export async function resetAllUsersTicketLimit(number_of_tickets_creation_limit: number) {
	try {
		const url = getRoute(API_USERS_PROPERTIES_RESET, {});
		const request = await requestFetch(url, {
			method: 'POST',
			body: JSON.stringify({ number_of_tickets_creation_limit })
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
