import { API_FILES_UPLOAD } from "$lib/constants/routes.constants";
import type { FileTypes, GetFile, PostFile } from "$lib/models/files/files.type";

export const uploadFile = async (payload: PostFile): Promise<GetFile> => {
  try {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('owner_id', payload.owner_id);

    const response = await fetch(API_FILES_UPLOAD, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export const detectFileType = (mime: string, ext: string): FileTypes => {
  const lowerMime = mime.toLowerCase();
  const lowerExt = ext.toLowerCase();

  if (lowerMime.startsWith("image/")) return "image";
  if (lowerMime.startsWith("video/")) return "video";
  if (lowerMime.startsWith("audio/")) return "audio";
  if (lowerMime === "application/pdf" || lowerExt === "pdf") return "pdf";
  if (["xlsx", "xls", "csv"].includes(lowerExt)) return "excel";
  if (["ppt", "pptx", "pps"].includes(lowerExt)) return "powerpoint";
  if (["doc", "docx", "odt", "rtf"].includes(lowerExt)) return "word";

  // Generic document bucket for common office/text formats
  if (lowerMime.startsWith("text/") || ["txt", "md"].includes(lowerExt)) return "document";

  return "other";
};