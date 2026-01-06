import type { Users } from "$lib/models/users/users.type";
import { changePassword, getMe } from "$lib/services/users/users.service";
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
  },

  changePassword: async (currentPassword: string, newPassword: string, userId: string) => {
    const toastId = toast.loading("Changing password...");
    try {
      const response = await changePassword(currentPassword, newPassword, userId);
      toast.success("Password changed successfully", { id: toastId });
      return response;
    } catch (error) {
      toast.error("Failed to change password");
      console.error(error);
      throw new Error((error as Error).message);
    }
  },
}