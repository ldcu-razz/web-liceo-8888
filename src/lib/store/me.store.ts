import type { Users } from "$lib/models/users/users.type";
import { getMe } from "$lib/services/users/users.service";
import { writable } from "svelte/store";
import { toast } from "svelte-sonner";

export const meStore = writable<Users | null>(null);

export const meActions = {
  getMe: async () => {
    try {
      const user = await getMe();
      meStore.set(user);
      return user;
    } catch (error) {
      toast.error("Failed to get current user");
      console.error(error);
      throw new Error((error as Error).message);
    }
  },

  setMe: (user: Users) => {
    meStore.set(user);
  }
}