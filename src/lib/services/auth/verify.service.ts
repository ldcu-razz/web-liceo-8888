import { API_AUTH_VERIFY_EMAIL } from "$lib/constants";

export async function verifyUserEmail(token: string): Promise<boolean> {
  try {
    const url = new URL(`${API_AUTH_VERIFY_EMAIL}`, window.location.origin);
    url.searchParams.set('token', token);
    const response = await fetch(url.toString(), {
      method: 'POST',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return true;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}