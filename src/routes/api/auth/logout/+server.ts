import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyAccessToken } from '$lib/utils/jwt.utils';
import { revokeSession } from '$lib/services/auth/session.service';
import type { LogoutResponse } from '$lib/models/session/session.type';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('access_token');

    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        await revokeSession(payload.sessionId);
      }
    }

    // Clear cookies with matching attributes
    cookies.delete('access_token', { 
      path: '/',
      httpOnly: true,
      secure: !dev,
      sameSite: 'strict'
    });
    cookies.delete('refresh_token', { 
      path: '/',
      httpOnly: true,
      secure: !dev,
      sameSite: 'strict'
    });

    const response: LogoutResponse = {
      success: true
    };

    return json(response);
  } catch (error) {
    console.error('Logout error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};