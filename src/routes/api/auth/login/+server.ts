import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { supabase } from '$lib/supabase/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '$lib/utils/jwt.utils';
import { createSession } from '$lib/services/auth/session.service';
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from '$lib/constants/session.constants';
import { TABLES } from '$lib/constants/tables.constants';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    // Find user by username
    const { data: user, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return json({ error: 'The credentials you entered are incorrect. Please try again.' }, { status: 401 });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return json({ error: 'The account is not active. Please contact the administrator if you think this is an error.' }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return json({ error: 'The credentials you entered are incorrect. Please try again.' }, { status: 401 });
    }

    // Generate tokens
    const sessionId = crypto.randomUUID();
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      sessionId
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create session in database
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds

    await createSession(sessionId, user.id, accessToken, refreshToken, userAgent, expiresIn);

    // Set httpOnly cookies for security
    cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: !dev, // false in development (local), true in production
      sameSite: 'strict',
      path: '/',
      maxAge: MAX_AGE_ACCESS_TOKEN
    });

    cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: !dev, // false in development (local), true in production
      sameSite: 'strict',
      path: '/',
      maxAge: MAX_AGE_REFRESH_TOKEN
    });

    // Return user data (without password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return json({
      success: true,
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};