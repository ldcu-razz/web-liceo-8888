import { supabase } from '$lib/supabase/client';
import type { Session } from '$lib/models/session/session.type';
import { TABLES } from '$lib/constants/tables.constants';

export async function createSession(
  sessionId: string,
  userId: string,
  accessToken: string,
  refreshToken: string,
  userAgent: string,
  expiresIn: number
): Promise<Session> {
  const now = new Date().toISOString();
  const expiredAt = Date.now() + expiresIn * 1000;

  const sessionData = {
    id: sessionId,
    user_id: userId,
    access_token: accessToken,
    refresh_token: refreshToken,
    user_agent: userAgent,
    expiredAt,
    is_revoked: false,
    createdAt: now,
    updatedAt: now
  };

  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    console.error('Failed to create session:', error);
    throw new Error(error.message);
  };
  return data as Session;
}

export async function getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .select('*')
    .eq('refresh_token', refreshToken)
    .eq('is_revoked', false)
    .single();

  if (error || !data) return null;
  return data as Session;
}

export async function revokeSession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLES.SESSIONS)
      .update({ is_revoked: true, updatedAt: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      console.error('Failed to revoke session:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to revoke session:', error);
    throw new Error(error as string);
  }
}

export async function updateSessionTokens(
  sessionId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<void> {
  const expiredAt = Date.now() + expiresIn * 1000;
  await supabase
    .from(TABLES.SESSIONS)
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiredAt,
      updatedAt: new Date().toISOString()
    })
    .eq('id', sessionId);
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await supabase
  .from(TABLES.SESSIONS)
    .update({ is_revoked: true, updatedAt: new Date().toISOString() })
    .eq('user_id', userId);
}
