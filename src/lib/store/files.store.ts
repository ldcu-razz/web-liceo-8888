import type { GetFile, PostFile } from "$lib/models/files/files.type";
import { uploadFile } from "$lib/services/files/files.service";
import { writable } from "svelte/store";

export const filesStore = writable<GetFile[]>([]);

export const filesActions = {
  uploadFile: async (payload: PostFile): Promise<GetFile> => {
    try {
      const file = await uploadFile(payload);
      filesStore.update((state) => [...state, file]);
      return file;
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  },
};