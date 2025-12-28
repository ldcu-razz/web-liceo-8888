import { API_AUTH_LOGIN, API_AUTH_LOGOUT } from "$lib/constants/routes.constants";
import type { LoginPayload, LoginResponse, LogoutResponse } from "$lib/models/session/session.type";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();

  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await fetch(API_AUTH_LOGOUT, {
      method: 'POST',
    });
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}