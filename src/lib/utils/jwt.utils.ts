import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../models/session/session.type';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import { DURATION_ACCESS_TOKEN, DURATION_REFRESH_TOKEN } from '$lib/constants/session.constants';

export function generateAccessToken(payload: TokenPayload): string {
  try {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: DURATION_ACCESS_TOKEN });
  } catch (error) {
    console.error('Error generating access token:', error);
    return '';
  }
}

export function generateRefreshToken(payload: TokenPayload): string {
  try {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: DURATION_REFRESH_TOKEN });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    return '';
  }
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Error verifying access token:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}