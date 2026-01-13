import { API_USERS_PROPERTIES } from '$lib/constants/routes.constants';
import type { PutUserProperties } from '$lib/models/users/user-properties.type';
import { getRoute } from '$lib/utils/routes.utils';
import { requestFetch } from '../request/request.service';

export async function getUserProperties(userId: string) {
	try {
		const url = getRoute(API_USERS_PROPERTIES, { id: userId });
		const request = await requestFetch(url);
		if (!request.ok) {
			throw new Error(request.statusText);
		}
		return request.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}

export async function updateUserProperties(userId: string, data: PutUserProperties) {
	try {
		const url = getRoute(API_USERS_PROPERTIES, { id: userId });
		const request = await requestFetch(url, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
		if (!request.ok) {
			throw new Error(request.statusText);
		}
		return request.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
}
