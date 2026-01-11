import {
	LOGIN,
	PUBLIC_ROUTES,
	PUBLIC_API_ROUTES,
	BASE_URL
} from '$lib/constants/routes.constants';
import {
	verifyAccessToken,
	verifyRefreshToken,
	generateAccessToken,
	generateRefreshToken
} from '$lib/utils/jwt.utils';
import { getSessionByRefreshToken, updateSessionTokens } from '$lib/services/auth/session.service';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from '$lib/constants/session.constants';
import { dev } from '$app/environment';
import type { TokenPayload } from '$lib/models/session/session.type';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	const isPublicRoute = PUBLIC_ROUTES.includes(path) || path === BASE_URL;
	const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) => path.startsWith(route));

	if (isPublicRoute || isPublicApiRoute) {
		return resolve(event);
	}

	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	const redirectToLogin = () => {
		event.cookies.delete('access_token', { path: '/', secure: !dev });
		event.cookies.delete('refresh_token', { path: '/', secure: !dev });

		if (path.startsWith('/api')) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		throw redirect(303, LOGIN);
	};

	if (!accessToken && !refreshToken) {
		return redirectToLogin();
	}

	let accessTokenPayload: TokenPayload | null = null;
	if (accessToken) {
		accessTokenPayload = verifyAccessToken(accessToken);
	}

	if (accessTokenPayload) {
		event.locals.user = accessTokenPayload;
		return resolve(event);
	}

	if (!refreshToken) {
		return redirectToLogin();
	}

	const refreshTokenPayload = verifyRefreshToken(refreshToken);

	if (!refreshTokenPayload) {
		return redirectToLogin();
	}

	try {
		const session = await getSessionByRefreshToken(refreshToken);

		if (!session) {
			return redirectToLogin();
		}

		if (session.expiredAt < Date.now()) {
			return redirectToLogin();
		}

		const newAccessToken = generateAccessToken(refreshTokenPayload);
		const newRefreshToken = generateRefreshToken(refreshTokenPayload);

		const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
		await updateSessionTokens(session.id, newAccessToken, newRefreshToken, expiresIn);

		// Set new cookies
		event.cookies.set('access_token', newAccessToken, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: MAX_AGE_ACCESS_TOKEN
		});

		event.cookies.set('refresh_token', newRefreshToken, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: MAX_AGE_REFRESH_TOKEN
		});

		event.locals.user = refreshTokenPayload;

		return resolve(event);
	} catch (error) {
		console.error('Error refreshing token:', error);
		return redirectToLogin();
	}
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const accessToken = event.cookies.get('access_token');
	console.log('handefetchaccessToken', accessToken);

	// If we have an access token, add it to the request headers
	if (accessToken) {
		// Clone the request and add the Authorization header
		const modifiedRequest = new Request(request, {
			headers: {
				...Object.fromEntries(request.headers),
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		return fetch(modifiedRequest);
	}

	// If no token, proceed with the original request
	return fetch(request);
};
