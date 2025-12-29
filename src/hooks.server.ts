import { LOGIN, CREATE_ACCOUNT, CREATE_ACCOUNT_SUCCESS, MAIN } from '$lib/constants/routes.constants';
import { 
  verifyAccessToken, 
  verifyRefreshToken, 
  generateAccessToken, 
  generateRefreshToken 
} from '$lib/utils/jwt.utils';
import { getSessionByRefreshToken, revokeSession, updateSessionTokens } from '$lib/services/auth/session.service';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from '$lib/constants/session.constants';
import { dev } from '$app/environment';
import type { TokenPayload } from '$lib/models/session/session.type';

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get('access_token');
  const refreshToken = event.cookies.get('refresh_token');
  
  // Helper function to clear auth cookies
  const clearAuthCookies = () => {
    event.cookies.delete('access_token', { 
      path: '/',
      httpOnly: true,
      secure: !dev,
      sameSite: 'strict'
    });
    event.cookies.delete('refresh_token', { 
      path: '/',
      httpOnly: true,
      secure: !dev,
      sameSite: 'strict'
    });
  };
  // Define auth routes for reuse
  const authRoutes = [LOGIN, CREATE_ACCOUNT, CREATE_ACCOUNT_SUCCESS];
  const isAuthRoute = authRoutes.some(route => event.url.pathname.startsWith(route));

  let payload: TokenPayload | null = null;
  let sessionId: string | null = null;

  if (accessToken) {
    payload = verifyAccessToken(accessToken);
    sessionId = payload?.sessionId ?? null;
  }

  if (accessToken && refreshToken) {
    if (!payload && refreshToken) {
      // Access token is invalid/expired, try to refresh
      try {
        console.log('Access token expired, attempting refresh...');
        
        // Verify refresh token
        const refreshPayload = verifyRefreshToken(refreshToken);
        if (!refreshPayload) {
          console.error('Invalid refresh token');
          clearAuthCookies();
          
          if (sessionId) {
            revokeSession(sessionId);
          }
          
          // Only redirect if not already on an auth page
          if (!isAuthRoute) {
            return new Response('Redirect', {
              status: 303,
              headers: { Location: `${LOGIN}` }
            });
          }
          // If on auth route, skip the token refresh process
          return resolve(event);
        }

        // Check if session exists and is not revoked
        const session = await getSessionByRefreshToken(refreshToken);
        if (!session) {
          console.error('Session not found or revoked');
          clearAuthCookies();

          if (sessionId) {
            revokeSession(sessionId);
          }
          
          // Only redirect if not already on an auth page
          if (!isAuthRoute) {
            return new Response('Redirect', {
              status: 303,
              headers: { Location: `${LOGIN}` }
            });
          }
          // If on auth route, skip the token refresh process
          return resolve(event);
        }

        // Check if session is expired
        if (session.expiredAt < Date.now()) {
          console.error('Session expired');
          clearAuthCookies();
          
          // Only redirect if not already on an auth page
          if (!isAuthRoute) {
            return new Response('Redirect', {
              status: 303,
              headers: { Location: `${LOGIN}` }
            });
          }
          // If on auth route, skip the token refresh process
          return resolve(event);
        }

        // Create clean payload without JWT metadata (exp, iat, etc.)
        const cleanPayload = {
          userId: refreshPayload.userId,
          username: refreshPayload.username,
          role: refreshPayload.role,
          sessionId: refreshPayload.sessionId
        };

        // Generate new tokens with clean payload
        const newAccessToken = generateAccessToken(cleanPayload);
        const newRefreshToken = generateRefreshToken(cleanPayload);

        // Update session in database
        const expiresIn = 7 * 24 * 60 * 60; // 7 days
        await updateSessionTokens(session.id, newAccessToken, newRefreshToken, expiresIn);

        // Set new cookies
        event.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: !dev,
          sameSite: 'strict',
          path: '/',
          maxAge: MAX_AGE_ACCESS_TOKEN
        });

        event.cookies.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: !dev,
          sameSite: 'strict',
          path: '/',
          maxAge: MAX_AGE_REFRESH_TOKEN
        });

        console.log('Tokens refreshed successfully');
        payload = cleanPayload;
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuthCookies();
        
        // Only redirect if not already on an auth page
        if (!isAuthRoute) {
          return new Response('Redirect', {
            status: 303,
            headers: { Location: `${LOGIN}` }
          });
        }
        // If on auth route, skip the token refresh process
        return resolve(event);
      }
    } else if (!payload) {
      // Access token is invalid and no refresh token available
      console.error('Invalid access token and no refresh token');
      clearAuthCookies();

      if (sessionId) {
        revokeSession(sessionId);
      }
      
      // Only redirect if not already on an auth page
      if (!isAuthRoute) {
        return new Response('Redirect', {
          status: 303,
          headers: { Location: `${LOGIN}` }
        });
      }
    }

    if (payload) {
      // Attach user info to locals for use in server-side code
      event.locals.user = {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
        sessionId: payload.sessionId
      };
    }
  }

  // Protect routes that require authentication
  const protectedRoutes = [MAIN];
  const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route));

  if (isProtectedRoute && !event.locals.user) {
    // Clear any invalid cookies before redirecting
    clearAuthCookies();
    if (sessionId) {
      revokeSession(sessionId);
    }
    return new Response('Redirect', {
      status: 303,
      headers: { Location: `${LOGIN}` }
    });
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && event.locals.user) {
    return new Response('Redirect', {
      status: 303,
      headers: { Location: '/main' }
    });
  }

  return resolve(event);
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
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return fetch(modifiedRequest);
  }

  // If no token, proceed with the original request
  return fetch(request);
};