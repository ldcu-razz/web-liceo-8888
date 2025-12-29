import { writable } from "svelte/store";
import type { LoginPayload, LoginResponse } from "$lib/models/session/session.type";
import { login, logout } from "$lib/services/auth/login.service";
import { toast } from "svelte-sonner";

export const authStore = writable<LoginResponse | null>(null);

export const authActions = {
  login: async (payload: LoginPayload) => {
    try {
      const response = await login(payload);
      
      if (response.success) {
        authStore.set(response);
      }
    } catch (error) {
      toast.error("Failed to login");
      console.error(error);
      throw new Error((error as Error).message);
    }
  },

  logout: async () => {
    try {
      const response = await logout();
      if (response.success) {
        authStore.set(null);
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  }
}