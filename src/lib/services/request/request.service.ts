import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { LOGIN, PUBLIC_API_ROUTES } from '$lib/constants/routes.constants';
import { toast } from 'svelte-sonner';

export class UnauthorizedError extends Error {
	constructor(message = 'Unauthorized') {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
	return error instanceof UnauthorizedError;
}

export const requestFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
	const response = await fetch(url, options);

	const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) => url.startsWith(route));
	if (isPublicApiRoute) {
		return response;
	}

	if (response.status === 401) {
		if (browser) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			await goto(LOGIN, { replaceState: true, invalidateAll: true });
			toast.error('Session expired. Please log in again.');
		}
		throw new UnauthorizedError('Session expired. Please log in again.');
	}

	return response;
};
