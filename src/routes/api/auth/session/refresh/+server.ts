import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '$lib/utils/jwt.utils';
import { getSessionByRefreshToken, updateSessionTokens } from '$lib/services/auth/session.service';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    const refreshToken = cookies.get('refresh_token');

    if (!refreshToken) {
      return json({ error: 'Refresh token not found' }, { status: 401 });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Check if session exists and is not revoked
    const session = await getSessionByRefreshToken(refreshToken);
    if (!session) {
      return json({ error: 'Session not found or revoked' }, { status: 401 });
    }

    // Check if session is expired
    if (session.expiredAt < Date.now()) {
      return json({ error: 'Session expired' }, { status: 401 });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Update session in database
    const expiresIn = 7 * 24 * 60 * 60;
    await updateSessionTokens(session.id, newAccessToken, newRefreshToken, expiresIn);

    // Set new cookies
    cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60
    });

    cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};